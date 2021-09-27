/* eslint-env jest */
import {
  getMockUserContext,
  getMockUserInfo,
  mockDate,
  DatabaseOperation,
  setMockDBResponse,
} from '../../test-utils'
import VideoAdLogModel from '../VideoAdLogModel'

jest.mock('../../databaseClient')
beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})
const userContext = getMockUserContext()
const user = getMockUserInfo()
describe('isVideoAdEligible', () => {
  it('returns true if user has less than 3 completed video ad logs in the last 24 hours', async () => {
    expect.assertions(1)
    const isVideoAdEligible = require('../isVideoAdEligible').default
    // Mock videoAdLog query
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    const result = await isVideoAdEligible(userContext, user)
    expect(result).toEqual(true)
  })

  it('returns false if user has  3 completed video ad logs in the last 24 hours', async () => {
    expect.assertions(1)
    const isVideoAdEligible = require('../isVideoAdEligible').default
    // Mock videoAdLog query
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [
        {
          userId: 'abcdefghijklmno',
          timestamp: '2017-07-17T20:45:53Z',
          completed: true,
          id: '1234567890asdfgh',
          truexEngagementId: 'asdf',
          truexCreativeId: '1234',
        },
        {
          userId: 'abcdefghijklmno',
          timestamp: '2017-07-17T20:46:53Z',
          completed: true,
          id: '1234567890asdfg1',
          truexEngagementId: 'asdf',
          truexCreativeId: '1234',
        },
        {
          userId: 'abcdefghijklmno',
          timestamp: '2017-07-17T20:47:53Z',
          completed: true,
          id: '1234567890asdfg1',
          truexEngagementId: 'asdf',
          truexCreativeId: '1234',
        },
      ],
    })
    const result = await isVideoAdEligible(userContext, user)
    expect(result).toEqual(false)
  })

  it('it forms the database query with a completed filter as expected', async () => {
    expect.assertions(1)
    const isVideoAdEligible = require('../isVideoAdEligible').default
    // Mock videoAdLog query
    const videoAdLogQuery = setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [],
    })
    await isVideoAdEligible(userContext, user)
    expect(videoAdLogQuery.mock.calls[0][0]).toEqual({
      ExpressionAttributeNames: {
        '#completed': 'completed',
        '#timestamp': 'timestamp',
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':completed': true,
        ':timestamp': '2017-05-18T13:59:46.000Z',
        ':timestamp_2': '2017-05-18T13:59:46.000Z',
        ':userId': 'abcdefghijklmno',
      },
      FilterExpression: '(#completed = :completed)',
      KeyConditionExpression:
        '(#timestamp BETWEEN :timestamp AND :timestamp_2) AND (#userId = :userId)',
      TableName: VideoAdLogModel.tableName,
    })
  })
})
