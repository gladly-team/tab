/* eslint-env jest */
import { verifyAndSendInvite } from '../utils'
import createInvitedUsers from '../createInvitedUsers'
import {
  DatabaseOperation,
  getMockUserContext,
  setMockDBResponse,
  getMockUserInstance,
  clearAllMockDBResponses,
} from '../../test-utils'

jest.mock('../utils', () => ({
  verifyAndSendInvite: jest.fn(),
}))
jest.mock('../../databaseClient')
jest.mock('../../globals/globals')
const userContext = getMockUserContext()

afterEach(() => {
  jest.clearAllMocks()
  clearAllMockDBResponses()
})
const userId = userContext.id
const mockParams = [userContext, userId, ['test123', 'test124'], 'alec']
describe('createInvitedUsers', () => {
  it('it successfully emails and invites new users', async () => {
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ user: 'test' }],
    })
    verifyAndSendInvite.mockReturnValueOnce({ email: 'test123' })
    verifyAndSendInvite.mockReturnValueOnce({ email: 'test124' })
    const results = await createInvitedUsers(...mockParams)
    expect(verifyAndSendInvite).toHaveBeenCalledTimes(2)
    expect(results.successfulEmailAddresses.length).toEqual(2)
    expect(results.failedEmailAddresses.length).toEqual(0)
  })

  it('it seperates failed email creations from succesful email creations', async () => {
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ user: 'test' }],
    })
    verifyAndSendInvite.mockReturnValueOnce({ email: 'test123' })
    verifyAndSendInvite.mockReturnValueOnce({
      email: 'test124',
      error: 'user already exists',
    })
    const results = await createInvitedUsers(...mockParams)
    expect(verifyAndSendInvite).toHaveBeenCalledTimes(2)
    expect(results.successfulEmailAddresses.length).toEqual(1)
    expect(results.failedEmailAddresses.length).toEqual(1)
  })

  it('it throws an error if user tries to create more than 50 invites in 24 hours', async () => {
    setMockDBResponse(DatabaseOperation.GET, {
      Item: getMockUserInstance(),
    })
    setMockDBResponse(DatabaseOperation.QUERY, {
      Items: [{ user: 'test' }],
    })
    verifyAndSendInvite.mockReturnValueOnce({ email: 'test123' })
    verifyAndSendInvite.mockReturnValueOnce({
      email: 'test124',
      error: 'user already exists',
    })
    const randomStringArray = []
    function makeid(length) {
      const result = []
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      for (let i = 0; i < length; i += 1) {
        result.push(
          characters.charAt(Math.floor(Math.random() * charactersLength))
        )
      }
      return result.join('')
    }
    for (let i = 0; i < 61; i += 1) {
      randomStringArray.push(makeid(9))
    }
    expect(
      createInvitedUsers(userContext, userId, randomStringArray, 'alec')
    ).rejects.toThrow()
  })
})
