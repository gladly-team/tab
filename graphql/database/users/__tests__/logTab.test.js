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
import getCampaign from '../../globals/getCampaign'
import callRedis from '../../../utils/redis'

jest.mock('lodash/number')
jest.mock('../../databaseClient')
jest.mock('../addVc')
jest.mock('../../globals/getCampaign')
jest.mock('../../../utils/redis')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

const getMockCampaign = ({
  campaignId = 'someCampaign',
  ...otherProps
} = {}) => ({
  campaignId,
  isActive: jest.fn(() => true),
  isLive: false,
  getNewUsersRedisKey: jest.fn(() => `campaign:${campaignId}:newUsers`),
  ...otherProps,
})

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

beforeEach(() => {
  jest.clearAllMocks()
  getCampaign.mockReturnValue(getMockCampaign())
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

describe('counting campaign new users', () => {
  it("calls Redis to increment the new user count when the user's tab count is exactly one and a campaign is active", async () => {
    expect.assertions(1)
    const userId = userContext.id

    const mockUser = getMockUserInstance({
      tabs: 1, // exactly one tab
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)

    // Mock that a campaign is active.
    getCampaign.mockReturnValue(
      getMockCampaign({
        campaignId: 'coolThing',
        isActive: jest.fn(() => true),
      })
    )

    await logTab(userContext, userId)

    expect(callRedis).toHaveBeenCalledWith({
      operation: 'INCR',
      key: 'campaign:coolThing:newUsers',
    })
  })

  it("does not call Redis to increment the new user count when the user's tab count is zero", async () => {
    expect.assertions(1)
    const userId = userContext.id

    const mockUser = getMockUserInstance({
      tabs: 0, // zero
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)

    // Mock that a campaign is active.
    getCampaign.mockReturnValue(
      getMockCampaign({
        campaignId: 'coolThing',
        isActive: jest.fn(() => true),
      })
    )

    await logTab(userContext, userId)

    expect(callRedis).not.toHaveBeenCalled()
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

    // Mock that a campaign is active.
    getCampaign.mockReturnValue(
      getMockCampaign({
        campaignId: 'coolThing',
        isActive: jest.fn(() => true),
      })
    )

    await logTab(userContext, userId)

    expect(callRedis).not.toHaveBeenCalled()
  })

  it("does not calls Redis to increment the new user count when the user's tab count is exactly one but a campaign is NOT live", async () => {
    expect.assertions(1)
    const userId = userContext.id

    const mockUser = getMockUserInstance({
      tabs: 1, // exactly one tab
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)

    // Mock that a campaign is NOT active.
    getCampaign.mockReturnValue(
      getMockCampaign({
        campaignId: 'coolThing',
        isActive: jest.fn(() => false),
      })
    )

    await logTab(userContext, userId)

    expect(callRedis).not.toHaveBeenCalled()
  })

  it('does not throw an error if Redis throws', async () => {
    expect.assertions(0)
    const userId = userContext.id

    const mockUser = getMockUserInstance({
      tabs: 1, // exactly one tab
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => mockUser)

    // Mock that a campaign is active.
    getCampaign.mockReturnValue(
      getMockCampaign({
        campaignId: 'coolThing',
        isActive: jest.fn(() => true),
      })
    )

    callRedis.mockRejectedValue("Well, that's not good.")

    await logTab(userContext, userId) // should not throw
  })
})
