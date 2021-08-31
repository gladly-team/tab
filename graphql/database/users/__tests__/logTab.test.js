/* eslint-env jest */

import moment from 'moment'
import uuid from 'uuid/v4'
import UserModel from '../UserModel'
import UserTabsLogModel from '../UserTabsLogModel'
import UserMissionModel from '../../missions/UserMissionModel'
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
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../../utils/permissions-overrides'
// We use an export from the mock file.
// eslint-disable-next-line import/named
import getCampaign, { mockCampaign } from '../../globals/getCampaign'
import { getEstimatedMoneyRaisedPerTab } from '../../globals/globals'
import getCurrentUserMission from '../../missions/getCurrentUserMission'
import completeMission from '../../missions/completeMission'

jest.mock('lodash/number')
jest.mock('../../databaseClient')
jest.mock('../addVc')
jest.mock('../../globals/getCampaign')
jest.mock('../../globals/globals')
jest.mock('../../missions/getCurrentUserMission')
jest.mock('../../missions/completeMission')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'
const missionsOverride = getPermissionsOverride(MISSIONS_OVERRIDE)

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

beforeEach(() => {
  getCampaign.mockReturnValue(mockCampaign)
  jest.clearAllMocks()
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
        isV4: true,
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
        isV4: true,
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
        isV4: true,
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
        isV4: true,
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
        isV4: true,
      })
    )
  })

  test('it logs the isV4 when given', async () => {
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
    const isV4 = false
    await logTab(userContext, userId, tabId, isV4)

    // It should create an item in UserTabsLog.
    expect(userTabsLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        tabId,
        isV4: false,
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

  test('when no current mission, does not interact with missions tab code', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      currentMissionId: undefined,
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
    await logTab(userContext, userId)
    expect(getCurrentUserMission).not.toHaveBeenCalled()
  })

  test('correctly updates user when they are part of a mission', async () => {
    expect.assertions(3)
    const mockDefaultMissionReturn = {
      missionId: '123456789',
      status: 'started',
      squadName: 'TestSquad',
      tabGoal: 1000,
      endOfMissionAwards: [],
      created: '2017-07-19T03:05:12Z',
      tabCount: 258,
      squadMembers: [
        {
          userId: 'abcdefghijklmno',
          username: 'alec',
          status: 'accepted',
          tabStreak: {
            longestTabStreak: 4,
            currentTabStreak: 2,
          },
          missionMaxTabsDay: {
            maxDay: {
              date: '2018-01-01T10:50:44.942Z',
              numTabs: 2,
            },
            recentDay: {
              date: '2018-01-01T10:50:44.942Z',
              numTabs: 2,
            },
          },
          tabs: 234,
        },
        {
          userId: 'omnlkjihgfedcba',
          username: 'kevin',
          status: 'accepted',
          tabStreak: {
            longestTabStreak: 4,
            currentTabStreak: 2,
          },
          missionMaxTabsDay: {
            maxDay: {
              date: '2017-01-01T10:50:44.942Z',
              numTabs: 5,
            },
            recentDay: {
              date: '2018-01-01T10:50:44.942Z',
              numTabs: 5,
            },
          },
          tabs: 24,
        },
      ],
    }
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      currentMissionId: '123456789',
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

    addVc.mockResolvedValue(mockUser)
    getCurrentUserMission.mockResolvedValue(mockDefaultMissionReturn)

    const updateUserMissionMethod = jest.spyOn(UserMissionModel, 'update')

    await logTab(userContext, userId)

    expect(getCurrentUserMission).toHaveBeenCalledWith({
      currentMissionId: '123456789',
      id: 'abcdefghijklmno',
    })

    expect(updateUserMissionMethod).toHaveBeenCalledWith(missionsOverride, {
      userId,
      missionId: '123456789',
      tabs: { $add: 1 },
      missionMaxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 149,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 149,
        },
      },
      tabStreak: {
        longestTabStreak: 4,
        currentTabStreak: 2,
      },
      updated: moment.utc().toISOString(),
    })

    expect(completeMission).not.toHaveBeenCalled()
  })

  test('correctly updates user and ends mission if applicable', async () => {
    expect.assertions(3)
    const mockDefaultMissionReturn = {
      missionId: '123456789',
      status: 'started',
      squadName: 'TestSquad',
      tabGoal: 1000,
      endOfMissionAwards: [],
      created: '2017-07-19T03:05:12Z',
      tabCount: 999,
      squadMembers: [
        {
          userId: 'abcdefghijklmno',
          username: 'alec',
          status: 'accepted',
          tabStreak: {
            longestTabStreak: 4,
            currentTabStreak: 2,
          },
          missionMaxTabsDay: {
            maxDay: {
              date: '2018-01-01T10:50:44.942Z',
              numTabs: 2,
            },
            recentDay: {
              date: '2018-01-01T10:50:44.942Z',
              numTabs: 2,
            },
          },
          tabs: 234,
        },
        {
          userId: 'omnlkjihgfedcba',
          username: 'kevin',
          status: 'accepted',
          tabStreak: {
            longestTabStreak: 4,
            currentTabStreak: 2,
          },
          missionMaxTabsDay: {
            maxDay: {
              date: '2017-01-01T10:50:44.942Z',
              numTabs: 5,
            },
            recentDay: {
              date: '2018-01-01T10:50:44.942Z',
              numTabs: 5,
            },
          },
          tabs: 765,
        },
      ],
    }
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      currentMissionId: '123456789',
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

    addVc.mockResolvedValue(mockUser)
    getCurrentUserMission.mockResolvedValue(mockDefaultMissionReturn)

    const updateUserMissionMethod = jest.spyOn(UserMissionModel, 'update')

    await logTab(userContext, userId)

    expect(getCurrentUserMission).toHaveBeenCalledWith({
      currentMissionId: '123456789',
      id: 'abcdefghijklmno',
    })

    expect(updateUserMissionMethod).toHaveBeenCalledWith(missionsOverride, {
      userId,
      missionId: '123456789',
      tabs: { $add: 1 },
      missionMaxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 149,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 149,
        },
      },
      tabStreak: {
        longestTabStreak: 4,
        currentTabStreak: 2,
      },
      updated: moment.utc().toISOString(),
    })

    expect(completeMission).toHaveBeenCalledWith(
      userId,
      mockDefaultMissionReturn.missionId
    )
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
    getCampaign.mockReturnValue(mockCampaign)

    await logTab(userContext, userId)

    expect(mockCampaign.incrementNewUserCount).toHaveBeenCalled()
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
    getCampaign.mockReturnValue(mockCampaign)

    await logTab(userContext, userId)
    expect(mockCampaign.incrementNewUserCount).not.toHaveBeenCalled()
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
    getCampaign.mockReturnValue(mockCampaign)

    await logTab(userContext, userId)
    expect(mockCampaign.incrementNewUserCount).not.toHaveBeenCalled()
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
    getCampaign.mockReturnValue({
      ...mockCampaign,
      incrementNewUserCount: jest.fn(async () => {
        throw mockErr
      }),
    })

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
    getCampaign.mockReturnValue(mockCampaign)

    await logTab(userContext, userId)
    expect(mockCampaign.incrementTabCount).toHaveBeenCalled()
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
    getCampaign.mockReturnValue(mockCampaign)

    await logTab(userContext, userId)
    expect(mockCampaign.incrementTabCount).not.toHaveBeenCalled()
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

    getCampaign.mockReturnValue({
      ...mockCampaign,
      incrementTabCount: jest.fn(async () => {
        throw mockErr
      }),
    })
    await expect(logTab(userContext, userId)).rejects.toEqual(mockErr)
  })
})

describe('campaign: estimating money raised', () => {
  it('adds to the money raised when the tab is valid', async () => {
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

    // Mock the estimated money raised per valid tab.
    getEstimatedMoneyRaisedPerTab.mockReturnValue(0.0081)

    getCampaign.mockReturnValue(mockCampaign)

    await logTab(userContext, userId)
    expect(mockCampaign.addMoneyRaised).toHaveBeenCalledWith(0.0081)
  })

  it('does not add to the money raised when the tab is not valid', async () => {
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
    getCampaign.mockReturnValue(mockCampaign)

    await logTab(userContext, userId)
    expect(mockCampaign.addMoneyRaised).not.toHaveBeenCalled()
  })

  it('throws if adding to money raised throws', async () => {
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
    getCampaign.mockReturnValue({
      ...mockCampaign,
      addMoneyRaised: jest.fn(async () => {
        throw mockErr
      }),
    })

    await expect(logTab(userContext, userId)).rejects.toEqual(mockErr)
  })
})
