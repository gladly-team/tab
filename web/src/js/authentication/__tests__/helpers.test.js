/* eslint-env jest */
import {
  goTo,
  replaceUrl,
  goToDashboard,
  goToLogin,
  enterUsernameURL,
  missingEmailMessageURL,
  verifyEmailURL
} from 'navigation/navigation'
import {
  getReferralData
} from 'web-utils'
import CreateNewUserMutation from 'mutations/CreateNewUserMutation'
import {
  getCurrentUser
} from 'authentication/user'

jest.mock('authentication/user')
jest.mock('navigation/navigation')
jest.mock('utils/localstorage-mgr')
jest.mock('web-utils')
jest.mock('mutations/CreateNewUserMutation')
jest.mock('authentication/user')

afterEach(() => {
  jest.clearAllMocks()
})

describe('checkAuthStateAndRedirectIfNeeded tests', () => {
  it('does not redirect if the user is fully authenticated', () => {
    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const user = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'foo',
      isAnonymous: false,
      emailVerified: true
    }
    const redirected = checkAuthStateAndRedirectIfNeeded(user)

    expect(redirected).toBe(false)
    expect(goToDashboard).not.toHaveBeenCalled()
    expect(goTo).not.toHaveBeenCalled()
    expect(replaceUrl).not.toHaveBeenCalled()
    expect(goToLogin).not.toHaveBeenCalled()
  })

  it('redirects to missing email screen if authed and there is no email address', () => {
    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const user = {
      id: 'abc123',
      email: null,
      username: 'foo',
      isAnonymous: false,
      emailVerified: true
    }
    const redirected = checkAuthStateAndRedirectIfNeeded(user)
    expect(replaceUrl).toHaveBeenCalledWith(missingEmailMessageURL)
    expect(redirected).toBe(true)
  })

  it('redirects to email verification screen if authed and email is unverified', () => {
    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const user = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'foo',
      isAnonymous: false,
      emailVerified: false
    }
    const redirected = checkAuthStateAndRedirectIfNeeded(user)
    expect(replaceUrl).toHaveBeenCalledWith(verifyEmailURL)
    expect(redirected).toBe(true)
  })

  it('redirects to new username screen if authed and username is not set', () => {
    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const user = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
    }
    const redirected = checkAuthStateAndRedirectIfNeeded(user)
    expect(replaceUrl).toHaveBeenCalledWith(enterUsernameURL)
    expect(redirected).toBe(true)
  })

  it('does not redirect to the new username screen if the username exists on the server', () => {
    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const user = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
    }
    const redirected = checkAuthStateAndRedirectIfNeeded(user, 'SomeUsername')
    expect(redirected).toBe(false)
  })
})

describe('createNewUser tests', () => {
  it('returns the new user data', async () => {
    expect.assertions(1)

    // Mock the authed user
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: false
    })

    getReferralData.mockImplementationOnce(() => null)

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementationOnce(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: 'somebody@example.com',
            username: null,
            justCreated: true
          }
        })
      }
    )

    const createNewUser = require('../helpers').createNewUser
    const newUser = await createNewUser()

    expect(newUser).toEqual({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      justCreated: true
    })
  })

  it('uses referral data when creating a new user', async () => {
    expect.assertions(1)
    getReferralData.mockImplementationOnce(() => ({
      referringUser: 'asdf1234'
    }))

    // Mock the authed user
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: false
    })

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementationOnce(
      (environment, userId, email, referralData, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: 'somebody@example.com',
            username: null,
            justCreated: true
          }
        })
      }
    )

    const createNewUser = require('../helpers').createNewUser
    await createNewUser('abc123', 'somebody@example.com')

    expect(CreateNewUserMutation.mock.calls[0][3]).toEqual({
      referringUser: 'asdf1234'
    })
  })
})
