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
import LogEmailVerifiedMutation from 'mutations/LogEmailVerifiedMutation'
import {
  getUserToken,
  getCurrentUser,
  reloadUser
} from 'authentication/user'
import {
  flushAllPromises,
  runAsyncTimerLoops
} from 'utils/test-utils'
import logger from 'utils/logger'

jest.mock('authentication/user')
jest.mock('navigation/navigation')
jest.mock('utils/localstorage-mgr')
jest.mock('web-utils')
jest.mock('mutations/CreateNewUserMutation')
jest.mock('mutations/LogEmailVerifiedMutation')
jest.mock('authentication/user')
jest.mock('../../../relay-env')
jest.mock('utils/logger')

afterEach(() => {
  jest.clearAllMocks()
})

describe('checkAuthStateAndRedirectIfNeeded tests', () => {
  it('does not redirect if the user is fully authenticated', async () => {
    expect.assertions(5)

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const user = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'foo',
      isAnonymous: false,
      emailVerified: true
    }
    const redirected = await checkAuthStateAndRedirectIfNeeded(user)

    expect(redirected).toBe(false)
    expect(goToDashboard).not.toHaveBeenCalled()
    expect(goTo).not.toHaveBeenCalled()
    expect(replaceUrl).not.toHaveBeenCalled()
    expect(goToLogin).not.toHaveBeenCalled()
  })

  it('redirects to missing email screen if authed and there is no email address', async () => {
    expect.assertions(2)

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const user = {
      id: 'abc123',
      email: null,
      username: 'foo',
      isAnonymous: false,
      emailVerified: false
    }
    const redirected = await checkAuthStateAndRedirectIfNeeded(user)
    expect(replaceUrl).toHaveBeenCalledWith(missingEmailMessageURL)
    expect(redirected).toBe(true)
  })

  it('redirects to email verification screen if authed and email is unverified', async () => {
    expect.assertions(2)

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const user = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'foo',
      isAnonymous: false,
      emailVerified: false
    }
    const redirected = await checkAuthStateAndRedirectIfNeeded(user)
    expect(replaceUrl).toHaveBeenCalledWith(verifyEmailURL)
    expect(redirected).toBe(true)
  })

  it('redirects to new username screen if authed and username is not set', async () => {
    expect.assertions(2)

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const user = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
    }
    const redirected = await checkAuthStateAndRedirectIfNeeded(user)
    expect(replaceUrl).toHaveBeenCalledWith(enterUsernameURL)
    expect(redirected).toBe(true)
  })

  it('does not redirect to the new username screen if the username exists on the server', async () => {
    expect.assertions(1)

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const user = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
    }
    const redirected = await checkAuthStateAndRedirectIfNeeded(user, 'SomeUsername')
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

describe('checkIfEmailVerified tests', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns true if the email is already verified', async () => {
    expect.assertions(1)

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
    })
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('../helpers').checkIfEmailVerified
    const isVerified = await checkIfEmailVerified()
    expect(isVerified).toBe(true)
  })

  it('returns false if the email is not verified', async () => {
    expect.assertions(1)

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: false
    })
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('../helpers').checkIfEmailVerified
    const promise = checkIfEmailVerified()
    await runAsyncTimerLoops(15)
    const isVerified = await promise
    expect(isVerified).toBe(false)
  })

  it('reloads the Firebase user a maximum of 11 times', async () => {
    expect.assertions(1)

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: false
    })
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('../helpers').checkIfEmailVerified
    const promise = checkIfEmailVerified()
    await runAsyncTimerLoops(15)
    await promise
    expect(reloadUser).toHaveBeenCalledTimes(11)
  })

  it('returns true if the email is verified after refetching the Firebase user a few times', async () => {
    expect.assertions(1)

    getCurrentUser
      .mockResolvedValueOnce({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: false
      })
      .mockResolvedValueOnce({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: false
      })
      // Third fetch has emailVerified=true
      .mockResolvedValue({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: true
      })
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('../helpers').checkIfEmailVerified
    const promise = checkIfEmailVerified()
    await runAsyncTimerLoops(15)
    const isVerified = await promise
    expect(isVerified).toBe(true)
  })

  it('stops refetching the Firebase user after it finds emailVerified=true', async () => {
    expect.assertions(1)

    getCurrentUser
      .mockResolvedValueOnce({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: false
      })
      .mockResolvedValueOnce({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: false
      })
      // Third fetch has emailVerified=true
      .mockResolvedValue({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: true
      })
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('../helpers').checkIfEmailVerified
    const promise = checkIfEmailVerified()
    await runAsyncTimerLoops(15)
    await promise
    expect(reloadUser).toHaveBeenCalledTimes(2)
  })

  it('calls a mutation to log the email as verified', async () => {
    expect.assertions(1)

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
    })
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('../helpers').checkIfEmailVerified
    await checkIfEmailVerified()
    expect(LogEmailVerifiedMutation)
      .toHaveBeenCalledWith({}, 'abc123', expect.any(Function), expect.any(Function))
  })

  it('force-refreshes the user token before logging the email as verified', async () => {
    expect.assertions(2)

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
    })
    reloadUser.mockImplementation(undefined)

    // Make getUserToken not resolve yet so we can confirm
    // the LogEmailVerifiedMutation has not yet been called.
    getUserToken.mockReturnValueOnce(new Promise(() => {}))

    const checkIfEmailVerified = require('../helpers').checkIfEmailVerified
    checkIfEmailVerified()
    await flushAllPromises()
    expect(getUserToken).toHaveBeenCalledWith(true)
    expect(LogEmailVerifiedMutation).not.toHaveBeenCalled()
  })

  it('logs an error if refreshing the user token throws an error', async (done) => {
    expect.assertions(2)

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: true
    })
    reloadUser.mockImplementation(undefined)
    const mockErr = new Error('Sigh.')
    getUserToken.mockRejectedValue(mockErr)

    const checkIfEmailVerified = require('../helpers').checkIfEmailVerified
    checkIfEmailVerified()
      // Ignore expected error
      .catch(e => {})
      .finally(() => {
        expect(logger.error).toHaveBeenCalledTimes(1)
        expect(logger.error).toHaveBeenCalledWith(mockErr)
        done()
      })
    await flushAllPromises()
  })

  it('logs an error if reloading the Firebase user throws an error', async (done) => {
    expect.assertions(2)

    getCurrentUser
      .mockResolvedValueOnce({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: false
      })
      .mockResolvedValue({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: true
      })
    const mockErr = new Error('Whoops!')
    reloadUser.mockRejectedValue(new Error('Whoops!'))
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('../helpers').checkIfEmailVerified
    checkIfEmailVerified()
      // Ignore expected error
      .catch(e => {})
      .finally(() => {
        expect(logger.error).toHaveBeenCalledTimes(1)
        expect(logger.error).toHaveBeenCalledWith(mockErr)
        done()
      })
    await runAsyncTimerLoops(15)
  })

  it('logs an error if getting the user throws an error', async (done) => {
    expect.assertions(2)

    const mockErr = new Error('Uh oh.')
    getCurrentUser
      .mockRejectedValue(mockErr)
    reloadUser.mockRejectedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('../helpers').checkIfEmailVerified
    checkIfEmailVerified()
      // Ignore expected error
      .catch(e => {})
      .finally(() => {
        expect(logger.error).toHaveBeenCalledTimes(1)
        expect(logger.error).toHaveBeenCalledWith(mockErr)
        done()
      })
    await runAsyncTimerLoops(15)
  })
})
