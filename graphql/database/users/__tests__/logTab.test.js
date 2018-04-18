/* eslint-env jest */

import moment from 'moment'
import uuid from 'uuid/v4'
import UserModel from '../UserModel'
import UserTabsLogModel from '../UserTabsLogModel'
import logTab from '../logTab'
import addVc from '../addVc'
import {
  DatabaseOperation,
  addTimestampFieldsToItem,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../addVc')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true
  })
})

afterAll(() => {
  mockDate.off()
})

describe('logTab', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('when a valid tab, it increments the VC and valid tab counts', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z'
    })
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: mockUser
      }
    )
    const updateMethod = jest.spyOn(UserModel, 'update')
      .mockImplementationOnce(() => {
        return mockUser
      })

    const returnedUser = await logTab(userContext, userId)

    // VC should increment.
    expect(addVc).toHaveBeenCalled()

    // It should update tabs and validTabs.
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      id: userId,
      tabs: {$add: 1},
      validTabs: {$add: 1},
      lastTabTimestamp: moment.utc().toISOString(),
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 1
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 1
        }
      }
    })
    expect(returnedUser).not.toBeNull()
  })

  test('when a valid tab, it logs the tab for analytics', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z'
    })
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: mockUser
      }
    )
    const userTabsLogCreate = jest.spyOn(UserTabsLogModel, 'create')
    await logTab(userContext, userId)

    // It should create an item in UserTabsLog.
    expect(userTabsLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userId,
        timestamp: moment.utc().toISOString()
      })
    )
  })

  test('it logs the tab ID when given', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z'
    })
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: mockUser
      }
    )
    const userTabsLogCreate = jest.spyOn(UserTabsLogModel, 'create')
    const tabId = uuid()
    await logTab(userContext, userId, tabId)

    // It should create an item in UserTabsLog.
    expect(userTabsLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId: userId,
        timestamp: moment.utc().toISOString(),
        tabId: tabId
      })
    )
  })

  test('an invalid tab (because of too-quickly-opened tabs) does not increment VC or valid tab counts', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:26.000Z'
    })
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: mockUser
      }
    )
    const updateMethod = jest.spyOn(UserModel, 'update')
      .mockImplementationOnce(() => {
        return mockUser
      })

    const returnedUser = await logTab(userContext, userId)

    // VC should not increment.
    expect(addVc).not.toHaveBeenCalled()

    // It should update tabs but not validTabs.
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      id: userId,
      tabs: {$add: 1},
      lastTabTimestamp: moment.utc().toISOString(),
      maxTabsDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numTabs: 1
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 1
        }
      }
    })
    expect(returnedUser).not.toBeNull()
  })

  test('for the first tab logged today, it resets the date for today\'s tab counter', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      maxTabsDay: {
        maxDay: {
          date: moment.utc().subtract(3, 'days').toISOString(),
          numTabs: 20
        },
        recentDay: {
          date: moment.utc().subtract(5, 'days').toISOString(),
          numTabs: 5
        }
      }
    })
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: mockUser
      }
    )
    const updateMethod = jest.spyOn(UserModel, 'update')
      .mockImplementationOnce(() => {
        return mockUser
      })

    await logTab(userContext, userId)

    // maxTabsDay should set recentDay.date to today.
    const maxTabsDayVal = updateMethod.mock.calls[0][1].maxTabsDay
    expect(maxTabsDayVal).toEqual({
      maxDay: {
        date: moment.utc().subtract(3, 'days').toISOString(),
        numTabs: 20 // stayed the same
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numTabs: 1 // reset to 1
      }
    })
  })

  test('when this is not the first tab today, it increments the tab value', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      maxTabsDay: {
        maxDay: {
          date: moment.utc().subtract(3, 'days').toISOString(),
          numTabs: 20
        },
        recentDay: {
          date: moment.utc().toISOString(), // today
          numTabs: 5
        }
      }
    })
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: mockUser
      }
    )
    const updateMethod = jest.spyOn(UserModel, 'update')
      .mockImplementationOnce(() => {
        return mockUser
      })

    await logTab(userContext, userId)

    // maxTabsDay should set recentDay.date to today.
    const maxTabsDayVal = updateMethod.mock.calls[0][1].maxTabsDay
    expect(maxTabsDayVal).toEqual({
      maxDay: {
        date: moment.utc().subtract(3, 'days').toISOString(),
        numTabs: 20 // stayed the same
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numTabs: 6 // added 1
      }
    })
  })

  test('when today is also the max tab day, update the maxDay date', async () => {
    const userId = userContext.id

    // Mock fetching the user.
    const mockUser = getMockUserInstance({
      lastTabTimestamp: '2017-06-22T01:13:25.000Z',
      maxTabsDay: {
        maxDay: {
          date: moment.utc().subtract(3, 'days').toISOString(),
          numTabs: 44
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 43
        }
      }
    })
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: mockUser
      }
    )
    const updateMethod = jest.spyOn(UserModel, 'update')
      .mockImplementationOnce(() => {
        return mockUser
      })

    await logTab(userContext, userId)

    const maxTabsDayVal = updateMethod.mock.calls[0][1].maxTabsDay
    expect(maxTabsDayVal).toEqual({
      maxDay: {
        date: moment.utc().toISOString(), // today
        numTabs: 44
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numTabs: 44 // added 1
      }
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
          numTabs: 44
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 44
        }
      }
    })
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: mockUser
      }
    )
    const updateMethod = jest.spyOn(UserModel, 'update')
      .mockImplementationOnce(() => {
        return mockUser
      })

    await logTab(userContext, userId)

    const maxTabsDayVal = updateMethod.mock.calls[0][1].maxTabsDay
    expect(maxTabsDayVal).toEqual({
      maxDay: {
        date: moment.utc().toISOString(),
        numTabs: 45 // added 1
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numTabs: 45 // added 1
      }
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
          numTabs: 0
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numTabs: 0
        }
      }
    })
    setMockDBResponse(
      DatabaseOperation.GET,
      {
        Item: mockUser
      }
    )
    const updateMethod = jest.spyOn(UserModel, 'update')
      .mockImplementationOnce(() => {
        return mockUser
      })

    await logTab(userContext, userId)

    const maxTabsDayVal = updateMethod.mock.calls[0][1].maxTabsDay
    expect(maxTabsDayVal).toEqual({
      maxDay: {
        date: moment.utc().toISOString(),
        numTabs: 1 // added 1
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numTabs: 1 // added 1
      }
    })
  })
})
