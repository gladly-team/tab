/* eslint-env jest */

import moment from 'moment'
import {
  DatabaseOperation,
  clearAllMockDBResponses,
  getMockUserContext,
  getMockUserInfo,
  getMockUserInstance,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'

import UserSearchLogModel from '../UserSearchLogModel'

jest.mock('../../databaseClient')
const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

const MAX_SEARCHES_ONE_MINUTE = 6
const MAX_SEARCHES_FIVE_MINUTES = 15
const MAX_SEARCHES_ONE_DAY = 150

const createMockSearchLogItem = item =>
  Object.assign(
    {},
    {
      userId: 'abc123',
      timestamp: moment.utc().toISOString(),
      source: 'self',
    },
    item
  )

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

afterEach(() => {
  jest.clearAllMocks()
  clearAllMockDBResponses()
})

afterAll(() => {
  mockDate.off()
})

describe('checkSearchRateLimit', () => {
  it('calls the database', async () => {
    expect.assertions(2)
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    // Mock getting this user.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })

    const query = jest.spyOn(UserSearchLogModel, 'query')
    const queryExec = jest.spyOn(UserSearchLogModel, '_execAsync')

    await checkSearchRateLimit(userContext, userId)

    expect(query).toHaveBeenCalledWith(userContext, userId)
    expect(queryExec).toHaveBeenCalled()
  })

  it('queries UserSearchLog as expected', async () => {
    expect.assertions(1)
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    // Mock getting this user.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })

    // Mock UserSearchLogModel query
    const queryMock = setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    await checkSearchRateLimit(userContext, userId)

    expect(queryMock.mock.calls[0][0]).toEqual({
      ExpressionAttributeNames: {
        '#created': 'created',
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':created': '2017-06-22T01:03:28.000Z', // 10 minutes earlier
        ':created_2': '2017-06-22T01:13:28.000Z',
        ':userId': userId,
      },
      KeyConditionExpression:
        '(#created BETWEEN :created AND :created_2) AND (#userId = :userId)',
      TableName: UserSearchLogModel.tableName,
    })
  })

  it('returns the expected value when the user has exceeded the max daily limit', async () => {
    expect.assertions(1)
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    // Mock getting this user.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance({
        maxSearchesDay: {
          maxDay: {
            date: moment.utc().toISOString(),
            numSearches: 400,
          },
          recentDay: {
            date: moment.utc().toISOString(),
            numSearches: 153, // above daily maximum
          },
        },
      }),
    })

    // Mock UserSearchLogModel query
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })

    const returnedVal = await checkSearchRateLimit(userContext, userId)
    expect(returnedVal).toEqual({
      limitReached: true,
      reason: 'DAILY_MAX',
      checkIfHuman: false,
    })
  })

  it('does not query UserSearchLog when we already know the user has exceeded the daily max', async () => {
    expect.assertions(1)
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    // Mock getting this user.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance({
        maxSearchesDay: {
          maxDay: {
            date: moment.utc().toISOString(),
            numSearches: 400,
          },
          recentDay: {
            date: moment.utc().toISOString(),
            numSearches: MAX_SEARCHES_ONE_DAY + 3, // above daily maximum
          },
        },
      }),
    })

    const userSearchLogQuery = jest.spyOn(UserSearchLogModel, 'query')
    await checkSearchRateLimit(userContext, userId)
    expect(userSearchLogQuery).not.toHaveBeenCalled()
  })

  it('returns no search limit when there are no search logs', async () => {
    expect.assertions(1)
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    // Mock getting this user.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })

    // Mock UserSearchLogModel query
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })

    const returnedVal = await checkSearchRateLimit(userContext, userId)
    expect(returnedVal).toEqual({
      limitReached: false,
      reason: 'NONE',
      checkIfHuman: false,
    })
  })

  it('returns no search limit when the user opened fewer than max search limits', async () => {
    expect.assertions(1)
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    // Mock getting this user.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })

    // Mock UserSearchLogModel query
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: Array.from({ length: MAX_SEARCHES_ONE_MINUTE - 3 }).map(() => {
        return createMockSearchLogItem({
          timestamp: moment.utc().subtract(23, 'seconds'),
        })
      }),
    })

    const returnedVal = await checkSearchRateLimit(userContext, userId)
    expect(returnedVal).toEqual({
      limitReached: false,
      reason: 'NONE',
      checkIfHuman: false,
    })
  })

  it('returns no search limit when the user has opened exactly the max search limits', async () => {
    expect.assertions(1)
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    // Mock getting this user.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })

    // Mock UserSearchLogModel query
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: Array.from({ length: MAX_SEARCHES_ONE_MINUTE }).map(() => {
        return createMockSearchLogItem({
          timestamp: moment.utc().subtract(23, 'seconds'),
        })
      }),
    })

    const returnedVal = await checkSearchRateLimit(userContext, userId)
    expect(returnedVal).toEqual({
      limitReached: false,
      reason: 'NONE',
      checkIfHuman: false,
    })
  })

  it('returns no search limit when the user opened above the max searches in a minute but that was over 1 minute ago', async () => {
    expect.assertions(1)
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    // Mock getting this user.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })

    // Mock UserSearchLogModel query
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: Array.from({ length: MAX_SEARCHES_ONE_MINUTE + 3 }).map(() => {
        return createMockSearchLogItem({
          timestamp: moment.utc().subtract(62, 'seconds'),
        })
      }),
    })

    const returnedVal = await checkSearchRateLimit(userContext, userId)
    expect(returnedVal).toEqual({
      limitReached: false,
      reason: 'NONE',
      checkIfHuman: false,
    })
  })

  it('returns a search limit when the user opened more than the max searches in a minute', async () => {
    expect.assertions(1)
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    // Mock getting this user.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })

    // Mock UserSearchLogModel query
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: Array.from({ length: MAX_SEARCHES_ONE_MINUTE + 2 }).map(() => {
        return createMockSearchLogItem({
          timestamp: moment.utc().subtract(23, 'seconds'),
        })
      }),
    })

    const returnedVal = await checkSearchRateLimit(userContext, userId)
    expect(returnedVal).toEqual({
      limitReached: true,
      reason: 'ONE_MINUTE_MAX',
      checkIfHuman: false,
    })
  })

  it('returns a search limit when the user opened more than the max searches in five minutes', async () => {
    expect.assertions(1)
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    // Mock getting this user.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })

    // Mock UserSearchLogModel query
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: []
        .concat(
          Array.from({ length: MAX_SEARCHES_FIVE_MINUTES - 4 }).map(() => {
            return createMockSearchLogItem({
              timestamp: moment.utc().subtract(2, 'minutes'),
            })
          })
        )
        .concat(
          Array.from({ length: 7 }).map(() => {
            return createMockSearchLogItem({
              timestamp: moment.utc().subtract(4, 'minutes'),
            })
          })
        ),
    })

    const returnedVal = await checkSearchRateLimit(userContext, userId)
    expect(returnedVal).toEqual({
      limitReached: true,
      reason: 'FIVE_MINUTE_MAX',
      checkIfHuman: false,
    })
  })

  it('returns a "five minute" search limit when the user opened both too many tabs in 5 minutes and too many in one minute', async () => {
    expect.assertions(1)
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    // Mock getting this user.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })

    // Mock UserSearchLogModel query
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: []
        .concat(
          Array.from({ length: MAX_SEARCHES_ONE_MINUTE + 2 }).map(() => {
            return createMockSearchLogItem({
              timestamp: moment.utc().subtract(30, 'seconds'),
            })
          })
        )
        .concat(
          Array.from({ length: MAX_SEARCHES_FIVE_MINUTES + 4 }).map(() => {
            return createMockSearchLogItem({
              timestamp: moment.utc().subtract(3, 'minutes'),
            })
          })
        ),
    })

    const returnedVal = await checkSearchRateLimit(userContext, userId)
    expect(returnedVal).toEqual({
      limitReached: true,
      reason: 'FIVE_MINUTE_MAX',
      checkIfHuman: false,
    })
  })

  it('does not return a search limit when the user opened more than the max searches in five minutes but not within the previous 5 minutes', async () => {
    expect.assertions(1)
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    // Mock getting this user.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })

    // Mock UserSearchLogModel query
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: []
        .concat(
          Array.from({ length: MAX_SEARCHES_FIVE_MINUTES - 1 }).map(() => {
            return createMockSearchLogItem({
              timestamp: moment.utc().subtract(6, 'minutes'),
            })
          })
        )
        .concat(
          Array.from({ length: 3 }).map(() => {
            return createMockSearchLogItem({
              timestamp: moment.utc().subtract(4, 'minutes'),
            })
          })
        ),
    })

    const returnedVal = await checkSearchRateLimit(userContext, userId)
    expect(returnedVal).toEqual({
      limitReached: false,
      reason: 'NONE',
      checkIfHuman: false,
    })
  })
})
