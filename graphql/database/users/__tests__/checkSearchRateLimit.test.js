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
            numSearches: 153, // above daily maximum
          },
        },
      }),
    })

    const userSearchLogQuery = jest.spyOn(UserSearchLogModel, 'query')
    await checkSearchRateLimit(userContext, userId)
    expect(userSearchLogQuery).not.toHaveBeenCalled()
  })

  it('returns the expected value when there are no search logs', async () => {
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
})
