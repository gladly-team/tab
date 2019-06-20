/* eslint-env jest */

import moment from 'moment'
import UserModel from '../UserModel'
import UserSearchLogModel from '../UserSearchLogModel'
import logSearch from '../logSearch'
import checkSearchRateLimit from '../checkSearchRateLimit'
import addVc from '../addVc'
import {
  DatabaseOperation,
  addTimestampFieldsToItem,
  clearAllMockDBResponses,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../addVc')
jest.mock('../checkSearchRateLimit')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

const mockCheckSearchRateLimitResponse = overrides =>
  Object.assign(
    {},
    {
      limitReached: false,
      reason: 'NONE',
      checkIfHuman: false,
    },
    overrides
  )

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

beforeEach(() => {
  jest.clearAllMocks()
  checkSearchRateLimit.mockResolvedValue(mockCheckSearchRateLimitResponse())
})

afterAll(() => {
  mockDate.off()
  clearAllMockDBResponses()
})

describe('logSearch', () => {
  test('when the user should receive VC, it increments the VC', async () => {
    expect.assertions(2)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 148,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })

    // Mock that the user SHOULD receive a heart.
    checkSearchRateLimit.mockResolvedValue(
      mockCheckSearchRateLimitResponse({
        limitReached: false,
        reason: 'NONE',
      })
    )

    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logSearch(userContext, userId)

    // VC should increment.
    expect(addVc).toHaveBeenCalled()

    // It should update searches and maxSearchesDay values.
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      id: userId,
      searches: { $add: 1 },
      lastSearchTimestamp: moment.utc().toISOString(),
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 149,
        },
      },
    })
  })

  test('when the user has reached a VC limit, it does not increment the VC', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 148,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })

    // Mock that the user should NOT receive a heart.
    checkSearchRateLimit.mockResolvedValue(
      mockCheckSearchRateLimitResponse({
        limitReached: true,
        reason: 'ONE_MINUTE_MAX',
      })
    )
    await logSearch(userContext, userId)
    expect(addVc).not.toHaveBeenCalled()
  })

  test('it logs the search for analytics', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    checkSearchRateLimit.mockResolvedValue(
      mockCheckSearchRateLimitResponse({
        limitReached: false,
        reason: 'NONE',
      })
    )

    const userSearchLogCreate = jest.spyOn(UserSearchLogModel, 'create')
    await logSearch(userContext, userId)

    expect(userSearchLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
      })
    )
  })

  test('when the user should not receive VC, it still logs the search for analytics', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })

    // Mock that the user should NOT receive a heart.
    checkSearchRateLimit.mockResolvedValue(
      mockCheckSearchRateLimitResponse({
        limitReached: true,
        reason: 'DAILY_MAX',
      })
    )

    const userSearchLogCreate = jest.spyOn(UserSearchLogModel, 'create')
    await logSearch(userContext, userId)

    expect(userSearchLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
      })
    )
  })

  test("for the first search logged today, it resets the date for today's search counter", async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment
            .utc()
            .subtract(3, 'days')
            .toISOString(),
          numSearches: 20,
        },
        recentDay: {
          date: moment
            .utc()
            .subtract(5, 'days')
            .toISOString(),
          numSearches: 5,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logSearch(userContext, userId)

    // maxSearchesDay should set recentDay.date to today.
    const maxSearchesDayVal = updateMethod.mock.calls[0][1].maxSearchesDay
    expect(maxSearchesDayVal).toEqual({
      maxDay: {
        date: moment
          .utc()
          .subtract(3, 'days')
          .toISOString(),
        numSearches: 20, // stayed the same
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numSearches: 1, // reset to 1
      },
    })
  })

  test('when this is not the first search today, it increments the search count', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment
            .utc()
            .subtract(3, 'days')
            .toISOString(),
          numSearches: 20,
        },
        recentDay: {
          date: moment.utc().toISOString(), // today
          numSearches: 5,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logSearch(userContext, userId)

    // maxSearchesDay should set recentDay.date to today.
    const maxSearchesDayVal = updateMethod.mock.calls[0][1].maxSearchesDay
    expect(maxSearchesDayVal).toEqual({
      maxDay: {
        date: moment
          .utc()
          .subtract(3, 'days')
          .toISOString(),
        numSearches: 20, // stayed the same
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numSearches: 6, // added 1
      },
    })
  })

  test('when today is also the max search day, update the maxDay date', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment
            .utc()
            .subtract(3, 'days')
            .toISOString(),
          numSearches: 44,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 43,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logSearch(userContext, userId)

    const maxSearchesDayVal = updateMethod.mock.calls[0][1].maxSearchesDay
    expect(maxSearchesDayVal).toEqual({
      maxDay: {
        date: moment.utc().toISOString(), // today
        numSearches: 44,
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numSearches: 44, // added 1
      },
    })
  })

  test('the max searches count increases when exceeding it', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 44,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 44,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logSearch(userContext, userId)

    const maxSearchesDayVal = updateMethod.mock.calls[0][1].maxSearchesDay
    expect(maxSearchesDayVal).toEqual({
      maxDay: {
        date: moment.utc().toISOString(),
        numSearches: 45, // added 1
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numSearches: 45, // added 1
      },
    })
  })

  test('max search day values work appropriately for new users', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 0,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 0,
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce(() => mockUser)

    await logSearch(userContext, userId)

    const maxSearchesDayVal = updateMethod.mock.calls[0][1].maxSearchesDay
    expect(maxSearchesDayVal).toEqual({
      maxDay: {
        date: moment.utc().toISOString(),
        numSearches: 1, // added 1
      },
      recentDay: {
        date: moment.utc().toISOString(),
        numSearches: 1, // added 1
      },
    })
  })

  test('it logs the source of the search when provided', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 148, // valid: below daily maximum
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const userSearchLogCreate = jest.spyOn(UserSearchLogModel, 'create')
    await logSearch(userContext, userId, {
      source: 'chrome',
    })

    expect(userSearchLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        source: 'chrome',
      })
    )
  })

  test('it does not logs the source of the search when it is not one of the valid sources', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      maxSearchesDay: {
        maxDay: {
          date: moment.utc().toISOString(),
          numSearches: 400,
        },
        recentDay: {
          date: moment.utc().toISOString(),
          numSearches: 148, // valid: below daily maximum
        },
      },
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const userSearchLogCreate = jest.spyOn(UserSearchLogModel, 'create')
    await logSearch(userContext, userId, {
      source: 'blahblahblah',
    })

    expect(userSearchLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
      })
    )
  })
})
