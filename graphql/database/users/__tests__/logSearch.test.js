/* eslint-env jest */

import moment from 'moment'
import UserModel from '../UserModel'
import UserSearchLogModel from '../UserSearchLogModel'
import logSearch from '../logSearch'
import checkSearchRateLimit from '../checkSearchRateLimit'
// import addVc from '../addVc'
import {
  DatabaseOperation,
  addTimestampFieldsToItem,
  clearAllMockDBResponses,
  getMockUserContext,
  getMockUserInstance,
  getMockAnonUserContext,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'
import getUserSearchEngine from '../getUserSearchEngine'

const mockTestNanoId = '12345'

jest.mock('../getUserSearchEngine')
jest.mock('../../databaseClient')
jest.mock('../addVc')
jest.mock('../checkSearchRateLimit')
jest.mock('nanoid', () => {
  return { nanoid: () => mockTestNanoId }
})

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
  getUserSearchEngine.mockResolvedValue({
    id: 'Bing',
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
  test('it returns the user', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      searches: 14,
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
    const expectedUser = {
      ...mockUser,
      lastSearchTimestamp: '2017-06-22T01:13:28.000Z',
      searches: 15,
      maxSearchesDay: {
        ...mockUser.maxSearchesDay,
        recentDay: {
          ...mockUser.maxSearchesDay.recentDay,
          date: '2017-06-22T01:13:28.000Z',
          numSearches: 1,
        },
      },
    }
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    jest
      .spyOn(UserModel, 'update')
      .mockImplementationOnce((_, updatedUser) => ({
        ...mockUser,
        ...updatedUser,
        searches: 15, // hardcode $add operation
      }))

    const response = await logSearch(userContext, userId)
    expect(response.user).toEqual(expectedUser)
  })

  test('it logs the search for analytics', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      v4BetaEnabled: false,
      causeId: 'testCauseId',
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
        searchEngine: 'Bing',
        isAnonymous: false,
        version: 1,
      })
    )
  })

  test('it logs the search with cause id for analytics', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const mockUser = getMockUserInstance({
      lastSearchTimestamp: '2017-06-22T01:13:25.000Z',
      v4BetaEnabled: true,
      causeId: 'testCauseId',
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
        searchEngine: 'Bing',
        causeId: 'testCauseId',
        isAnonymous: false,
        version: 1,
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
    await logSearch(userContext, userId, null, {
      source: 'chrome',
    })

    expect(userSearchLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        source: 'chrome',
        searchEngine: 'Bing',
        isAnonymous: false,
        version: 1,
      })
    )
  })

  test('it overrides causeId, version and searchEngineId when provided', async () => {
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
      causeId: 'testCauseId',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    const userSearchLogCreate = jest.spyOn(UserSearchLogModel, 'create')
    await logSearch(userContext, userId, null, {
      source: 'chrome',
      searchEngineId: 'Ecosia',
      causeId: 'abcd',
      version: 3,
    })

    expect(userSearchLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        source: 'chrome',
        searchEngine: 'Ecosia',
        isAnonymous: false,
        version: 3,
        causeId: 'abcd',
      })
    )
  })

  test('it does not log the source of the search when it is not one of the valid sources', async () => {
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
    await logSearch(userContext, userId, null, {
      source: 'blahblahblah',
    })

    expect(userSearchLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
        searchEngine: 'Bing',
        isAnonymous: false,
        version: 1,
      })
    )
  })

  test('logs search when anon user id is set', async () => {
    expect.assertions(2)

    const anonUserContext = getMockAnonUserContext()
    const userSearchLogCreate = jest.spyOn(UserSearchLogModel, 'create')
    const userGet = jest.spyOn(UserModel, 'get')
    await logSearch(anonUserContext, null, anonUserContext.anonId, {
      source: 'blahblahblah',
    })

    expect(userGet).not.toHaveBeenCalled()
    expect(userSearchLogCreate).toHaveBeenLastCalledWith(
      anonUserContext,
      addTimestampFieldsToItem({
        userId: anonUserContext.anonId,
        timestamp: moment.utc().toISOString(),
        searchEngine: 'SearchForACause',
        isAnonymous: true,
        version: 1,
      })
    )
  })

  test('logs search with causeId, searchEngineId and version when anon user id is set', async () => {
    expect.assertions(2)

    const anonUserContext = getMockAnonUserContext()
    const userSearchLogCreate = jest.spyOn(UserSearchLogModel, 'create')
    const userGet = jest.spyOn(UserModel, 'get')
    await logSearch(anonUserContext, null, anonUserContext.anonId, {
      source: 'blahblahblah',
      causeId: 'testCauseId',
      searchEngineId: 'Bing',
      version: 3,
    })

    expect(userGet).not.toHaveBeenCalled()
    expect(userSearchLogCreate).toHaveBeenLastCalledWith(
      anonUserContext,
      addTimestampFieldsToItem({
        userId: anonUserContext.anonId,
        timestamp: moment.utc().toISOString(),
        isAnonymous: true,
        version: 3,
        causeId: 'testCauseId',
        searchEngine: 'Bing',
      })
    )
  })

  test('logs search with random generated nanoid when neither user id nor anon id set', async () => {
    expect.assertions(2)

    const anonUserContext = {
      ...getMockAnonUserContext(),
      anonId: mockTestNanoId,
    }
    const userSearchLogCreate = jest.spyOn(UserSearchLogModel, 'create')
    const userGet = jest.spyOn(UserModel, 'get')
    await logSearch(anonUserContext, null, null, {
      source: 'blahblahblah',
    })

    expect(userGet).not.toHaveBeenCalled()
    expect(userSearchLogCreate).toHaveBeenLastCalledWith(
      anonUserContext,
      addTimestampFieldsToItem({
        userId: mockTestNanoId,
        timestamp: moment.utc().toISOString(),
        searchEngine: 'SearchForACause',
        isAnonymous: true,
        version: 1,
      })
    )
  })
})
