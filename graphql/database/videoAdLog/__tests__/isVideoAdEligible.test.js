/* eslint-env jest */
import {
  getMockUserContext,
  getMockUserInfo,
  mockDate,
  DatabaseOperation,
  setMockDBResponse,
} from '../../test-utils'

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
})
