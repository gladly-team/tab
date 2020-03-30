/* eslint-env jest */

import moment from 'moment'
import uuid from 'uuid/v4'
import UserModel from '../UserModel'
import UserTabsLogModel from '../UserTabsLogModel'
import logTab from '../logTab'
import addVc from '../addVc'
import {
  MockAWSConditionalCheckFailedError,
  DatabaseOperation,
  addTimestampFieldsToItem,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'
import getCurrentCampaignConfig from '../../globals/getCurrentCampaignConfig'

jest.mock('lodash/number')
jest.mock('../../databaseClient')
jest.mock('../addVc')
jest.mock('../../globals/getCurrentCampaignConfig')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

// See createCampaignConfiguration.test.js.
const getMockCampaignConfiguration = () => ({
  addMoneyRaised: jest.fn(),
  campaignId: 'myCoolCampaign',
  content: {
    titleMarkdown: '## Some title',
    descriptionMarkdown: '#### A description goes here.',
  },
  endContent: {
    titleMarkdown: '## Another title',
    descriptionMarkdown: '#### Another description goes here.',
  },
  getCharityData: jest.fn(() =>
    Promise.resolve({
      id: 'some-charity-id',
      image: 'https://cdn.example.com/some-image.jpg',
      imageCaption: null,
      impact: 'This is what we show after a user donates hearts.',
      name: 'Some Charity',
      vcReceived: 9876543,
      website: 'https://foo.com',
    })
  ),
  goal: {
    getCurrentNumber: jest.fn(() => Promise.resolve(112358)),
    impactUnitSingular: 'Heart',
    impactUnitPlural: 'Hearts',
    impactVerbPastTense: 'raised',
    targetNumber: 10e6,
  },
  incrementNewUserCount: jest.fn(),
  incrementTabCount: jest.fn(),
  isActive: jest.fn(),
  showCountdownTimer: true,
  showHeartsDonationButton: true,
  showProgressBar: true,
  time: {
    start: '2020-05-01T18:00:00.000Z',
    end: '2020-05-05T18:00:00.000Z',
  },
})

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

beforeEach(() => {
  jest.clearAllMocks()
  getCurrentCampaignConfig.mockReturnValue(getMockCampaignConfiguration())
})

afterAll(() => {
  mockDate.off()
})

describe('logTab', () => {
  test('when a valid tab, it increments the VC and valid tab counts', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 148, // valid: below daily maximum
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    const returnedUser = await logTab(userContext, userId)

    // VC should increment.
    expect(addVc).toHaveBeenCalled()

    // It should update tabs and validTabs.
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      id: userId,
      tabs: { $add: 1 },
      validTabs: { $add: 1 },
      lastTabTimestamp: moment.utc().toISOString(),
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 149,
        },
      },
    })
    expect(returnedUser).not.toBeNull()
  })

  test('when a valid tab, it logs the tab for analytics', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)
    const userTabsLogCreate = jest.spyOn(UserTabsLogModel, 'create')
    await logTab(userContext, userId)

    // It should create an item in UserTabsLog.
    expect(userTabsLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
      })
    )
  })

  test('an invalid tab still logs the tab for analytics', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:28.000Z',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)
    const userTabsLogCreate = jest.spyOn(UserTabsLogModel, 'create')
    await logTab(userContext, userId)

    // It should create an item in UserTabsLog.
    expect(userTabsLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
      })
    )
  })

  test('it retries logging the tab if there is a key conflict with the timestamp', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)
    const userTabsLogCreate = jest.spyOn(UserTabsLogModel, 'create')

    // Mock that the tab log already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )

    await logTab(userContext, userId)

    // It should create an item in UserTabsLog.
    expect(userTabsLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
      })
    )
  })

  test('it retries logging the tab three times if there is a key conflict with the timestamp', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)
    const userTabsLogCreate = jest.spyOn(UserTabsLogModel, 'create')

    // Mock that the tab log already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )

    await logTab(userContext, userId)

    // It should create an item in UserTabsLog.
    expect(userTabsLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
      })
    )
  })

  test('it throws after 3 tries to log when a DB item already exists', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)
    jest.spyOn(UserTabsLogModel, 'create')

    // Mock that the tab log already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      MockAWSConditionalCheckFailedError()
    )

    await expect(logTab(userContext, userId)).rejects.toThrow()
  })

  test('it logs the tab ID when given', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)
    const userTabsLogCreate = jest.spyOn(UserTabsLogModel, 'create')
    const tabId = uuid()
    await logTab(userContext, userId, tabId)

    // It should create an item in UserTabsLog.
    expect(userTabsLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        tabId,
      })
    )
  })

  test('an invalid tab (because of too-quickly-opened tabs) does not increment VC or valid tab counts', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:26.000Z',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    const returnedUser = await logTab(userContext, userId)

    // VC should not increment.
    expect(addVc).not.toHaveBeenCalled()

    // It should update tabs but not validTabs.
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      id: userId,
      tabs: { $add: 1 },
      lastTabTimestamp: moment.utc().toISOString(),
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 1,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 1,
        },
      },
    })
    expect(returnedUser).not.toBeNull()
  })

  test('an invalid tab (because of exceeding daily tab maximum) does not increment VC or valid tab counts', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z', // valid
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 150, // invalid: exceeds maximum
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    const returnedUser = await logTab(userContext, userId)

    // VC should not increment.
    expect(addVc).not.toHaveBeenCalled()

    // It should update tabs but not validTabs.
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      id: userId,
      tabs: { $add: 1 },
      lastTabTimestamp: moment.utc().toISOString(),
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 151,
        },
      },
    })
    expect(returnedUser).not.toBeNull()
  })

  test("for the first tab logged today, it resets the date for today's tab counter", async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      maxTabsDay: {
        maxDay: {
          date: moment
            .utc()
            .subtract(3, 'days')
            .toISOString(),
          numTabs: 20,
        },
        recentDay: {
          date: moment
            .utc()
            .subtract(5, 'days')
            .toISOString(),
          numTabs: 5,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logTab(userContext, userId)

    // maxTabsDay should set recentDay.date to today.
    const maxTabsDayVal = updateMethod.mock.calls[0][1].maxTabsDay
    expect(maxTabsDayVal).toEqual({
      maxDay: {
        date: moment
          .utc()
          .subtract(3, 'days')
          .toISOString(),
        numTabs: 20, // stayed the same
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numTabs: 1, // reset to 1
      },
    })
  })

  test('when this is not the first tab today, it increments the tab value', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      maxTabsDay: {
        maxDay: {
          date: moment
            .utc()
            .subtract(3, 'days')
            .toISOString(),
          numTabs: 20,
        },
        recentDay: {
          date: moment.utc().toISOString(), // today
          numTabs: 5,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logTab(userContext, userId)

    // maxTabsDay should set recentDay.date to today.
    const maxTabsDayVal = updateMethod.mock.calls[0][1].maxTabsDay
    expect(maxTabsDayVal).toEqual({
      maxDay: {
        date: moment
          .utc()
          .subtract(3, 'days')
          .toISOString(),
        numTabs: 20, // stayed the same
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numTabs: 6, // added 1
      },
    })
  })

  test('when today is also the max tab day, update the maxDay date', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      maxTabsDay: {
        maxDay: {
          date: moment
            .utc()
            .subtract(3, 'days')
            .toISOString(),
          numTabs: 44,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 43,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logTab(userContext, userId)

    const maxTabsDayVal = updateMethod.mock.calls[0][1].maxTabsDay
    expect(maxTabsDayVal).toEqual({
      maxDay: {
        date: moment.utc().toISOString(), // today
        numTabs: 44,
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numTabs: 44, // added 1
      },
    })
  })

  test('the max tab count increases when exceeding it', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 44,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 44,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logTab(userContext, userId)

    const maxTabsDayVal = updateMethod.mock.calls[0][1].maxTabsDay
    expect(maxTabsDayVal).toEqual({
      maxDay: {
        date: moment.utc().toISOString(),
        numTabs: 45, // added 1
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numTabs: 45, // added 1
      },
    })
  })

  test('max tab day values work appropriately for new users', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 0,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 0,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logTab(userContext, userId)

    const maxTabsDayVal = updateMethod.mock.calls[0][1].maxTabsDay
    expect(maxTabsDayVal).toEqual({
      maxDay: {
        date: moment.utc().toISOString(),
        numTabs: 1, // added 1
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numTabs: 1, // added 1
      },
    })
  })
})

describe('campaign: counting new users', () => {
  it("increments the new user count when the user's tab count is exactly one", async () => {
    expect.assertions(1)
    const userId = userContext.id

    const mockUser = getMockUserInstance({
      tabs: 1, // exactly one tab
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue(mockCampaignConfig)

    await logTab(userContext, userId)

    expect(mockCampaignConfig.incrementNewUserCount).toHaveBeenCalled()
  })

  it("does not increment the new user count when the user's tab count is zero", async () => {
    expect.assertions(1)
    const userId = userContext.id

    const mockUser = getMockUserInstance({
      tabs: 0, // zero
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue(mockCampaignConfig)

    await logTab(userContext, userId)
    expect(mockCampaignConfig.incrementNewUserCount).not.toHaveBeenCalled()
  })

  it("does not call Redis to increment the new user count when the user's tab count is two", async () => {
    expect.assertions(1)
    const userId = userContext.id

    const mockUser = getMockUserInstance({
      tabs: 2, // two
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue(mockCampaignConfig)

    await logTab(userContext, userId)
    expect(mockCampaignConfig.incrementNewUserCount).not.toHaveBeenCalled()
  })

  it('throws if incrementing the new user count throws', async () => {
    expect.assertions(1)
    const userId = userContext.id

    const mockUser = getMockUserInstance({
      tabs: 1,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)

    // Mock that incrementing the campaign new user count throws.
    const mockErr = new Error('Yikes')
    const mockCampaignConfig = {
      ...getMockCampaignConfiguration(),
      incrementNewUserCount: jest.fn(async () => {
        throw mockErr
      }),
    }

    getCurrentCampaignConfig.mockReturnValue(mockCampaignConfig)
    await expect(logTab(userContext, userId)).rejects.toEqual(mockErr)
  })
})

describe('campaign: counting tabs', () => {
  it('increments the tab count when the tab is valid', async () => {
    expect.assertions(1)
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 148, // valid: below daily maximum
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue(mockCampaignConfig)

    await logTab(userContext, userId)
    expect(mockCampaignConfig.incrementTabCount).toHaveBeenCalled()
  })

  it('does not increment the tab count when the tab is not valid', async () => {
    expect.assertions(1)
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 152, // not valid: above daily maximum
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue(mockCampaignConfig)

    await logTab(userContext, userId)
    expect(mockCampaignConfig.incrementTabCount).not.toHaveBeenCalled()
  })

  it('throws if incrementing the tab count throws', async () => {
    expect.assertions(1)
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 148, // valid: below daily maximum
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)

    // Mock that incrementing the tab count throws.
    const mockErr = new Error('Yikes')
    const mockCampaignConfig = {
      ...getMockCampaignConfiguration(),
      incrementTabCount: jest.fn(async () => {
        throw mockErr
      }),
    }
    getCurrentCampaignConfig.mockReturnValue(mockCampaignConfig)
    await expect(logTab(userContext, userId)).rejects.toEqual(mockErr)
  })
})
