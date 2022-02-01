/* eslint-env jest */
import { verifyAndSendInvite, getUserInvites } from '../utils'
import createInvitedUsers from '../createInvitedUsers'
import { getMockUserContext, getMockUserInstance } from '../../test-utils'
import getCause from '../../cause/getCause'

jest.mock('../../cause/getCause')
jest.mock('../utils', () => ({
  verifyAndSendInvite: jest.fn(),
  sanitize: string => string,
  getUserInvites: jest.fn(),
}))
jest.mock('../../databaseClient')
jest.mock('../../globals/globals')
const userContext = getMockUserContext()

afterEach(() => {
  jest.clearAllMocks()
})
const userId = userContext.id
const mockParams = [userContext, userId, ['test123', 'test124'], 'alec']
describe('createInvitedUsers', () => {
  it('it successfully emails and invites new users', async () => {
    getUserInvites.mockReturnValueOnce([
      getMockUserInstance(),
      [{ user: 'test' }],
    ])
    getCause.mockReturnValueOnce({
      sharing: {
        sendgridEmailTemplateId: 'd-69707bd6c49a444fa68a99505930f801',
        email: {
          title: 'this is a title',
          faq: 'this is a faq',
          about: 'this is about',
        },
      },
    })
    verifyAndSendInvite.mockReturnValueOnce({ email: 'test123' })
    verifyAndSendInvite.mockReturnValueOnce({ email: 'test124' })
    const results = await createInvitedUsers(...mockParams)
    expect(verifyAndSendInvite).toHaveBeenCalledWith(
      expect.objectContaining({
        templateId: 'd-69707bd6c49a444fa68a99505930f801',
      })
    )
    expect(verifyAndSendInvite).toHaveBeenCalledTimes(2)
    expect(results.successfulEmailAddresses.length).toEqual(2)
    expect(results.failedEmailAddresses.length).toEqual(0)
  })

  it('it successfully emails and invites new users to #TEAMSEAS', async () => {
    getUserInvites.mockReturnValueOnce([
      getMockUserInstance(),
      [{ user: 'test' }],
    ])
    getCause.mockReturnValueOnce({
      sharing: {
        sendgridEmailTemplateId: 'd-ff97cd972da342a6a208f09235671479',
      },
    })
    verifyAndSendInvite.mockReturnValueOnce({ email: 'test123' })
    verifyAndSendInvite.mockReturnValueOnce({ email: 'test124' })
    const results = await createInvitedUsers(...mockParams)
    expect(verifyAndSendInvite).toHaveBeenCalledWith(
      expect.objectContaining({
        templateId: 'd-ff97cd972da342a6a208f09235671479',
      })
    )
    expect(verifyAndSendInvite).toHaveBeenCalledTimes(2)
    expect(results.successfulEmailAddresses.length).toEqual(2)
    expect(results.failedEmailAddresses.length).toEqual(0)
  })

  it('it seperates failed email creations from succesful email creations', async () => {
    getCause.mockReturnValueOnce({
      sharing: {
        sendgridEmailTemplateId: 'd-69707bd6c49a444fa68a99505930f801',
      },
    })
    getUserInvites.mockReturnValueOnce([
      getMockUserInstance(),
      [{ user: 'test' }],
    ])
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
    getCause.mockReturnValueOnce({
      sharing: {
        sendgridEmailTemplateId: 'd-69707bd6c49a444fa68a99505930f801',
      },
    })
    getUserInvites.mockReturnValueOnce([
      getMockUserInstance(),
      [{ user: 'test' }],
    ])
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
    ).rejects.toThrow('user is trying to invite too many people in 24 hours')
  })
})
