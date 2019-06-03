/* eslint-env jest */

import {
  DatabaseOperation,
  clearAllMockDBResponses,
  getMockUserContext,
  getMockUserInfo,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'

import UserSearchLogModel from '../UserSearchLogModel'
import UserModel from '../UserModel'

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
  test('checkSearchRateLimit calls the database', async () => {
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    const query = jest.spyOn(UserSearchLogModel, 'query')
    const queryExec = jest.spyOn(UserSearchLogModel, '_execAsync')

    await checkSearchRateLimit(userContext, userId)

    expect(query).toHaveBeenCalledWith(userContext, userId)
    expect(queryExec).toHaveBeenCalled()
  })

  test('checkSearchRateLimit UserSearchLog database queries as expected', async () => {
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

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

  test('checkSearchRateLimit (with no search logs) returns expected value', async () => {
    const userId = getMockUserInfo().id
    const checkSearchRateLimit = require('../checkSearchRateLimit').default

    const itemsToReturn = []
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: itemsToReturn,
    })

    const returnedVal = await checkSearchRateLimit(userContext, userId)
    expect(returnedVal).toEqual({
      limitReached: false,
      reason: 'NONE',
      checkIfHuman: false,
    })
  })
})
