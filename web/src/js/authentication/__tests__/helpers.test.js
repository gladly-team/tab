/* eslint-env jest */
import moment from 'moment'
import MockDate from 'mockdate'
import {
  goTo,
  replaceUrl,
  goToDashboard,
  authMessageURL,
  enterUsernameURL,
  loginURL,
  missingEmailMessageURL,
  verifyEmailURL,
} from 'js/navigation/navigation'
import { getReferralData, isInIframe } from 'js/utils/utils'
import CreateNewUserMutation from 'js/mutations/CreateNewUserMutation'
import LogEmailVerifiedMutation from 'js/mutations/LogEmailVerifiedMutation'
import {
  getUserToken,
  getCurrentUser,
  reloadUser,
  setUsernameInLocalStorage,
  signInAnonymously,
} from 'js/authentication/user'
import { flushAllPromises, runAsyncTimerLoops } from 'js/utils/test-utils'
import logger from 'js/utils/logger'
import { getUserTestGroupsForMutation } from 'js/utils/experiments'
import {
  getBrowserExtensionInstallId,
  getBrowserExtensionInstallTime,
} from 'js/utils/local-user-data-mgr'
import { isAnonymousUserSignInEnabled } from 'js/utils/feature-flags'
import environment from 'js/relay-env'

jest.mock('js/relay-env')
jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')
jest.mock('js/utils/localstorage-mgr')
jest.mock('js/utils/utils')
jest.mock('js/mutations/CreateNewUserMutation')
jest.mock('js/mutations/LogEmailVerifiedMutation')
jest.mock('js/authentication/user')
jest.mock('js/relay-env')
jest.mock('js/utils/logger')
jest.mock('js/utils/experiments')
jest.mock('js/utils/local-user-data-mgr')
jest.mock('js/utils/feature-flags')

const mockNow = '2017-05-19T13:59:58.000Z'

const setIfAnonymousUserIsAllowed = allow => {
  // Set the mocked return values that will allow or
  // or disallow the user to be anonymous.
  if (allow) {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(11, 'seconds')
    )
    isAnonymousUserSignInEnabled.mockReturnValue(true)
  } else {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(23, 'days')
    )
    isAnonymousUserSignInEnabled.mockReturnValue(false)
  }
}

beforeAll(() => {
  getUserToken.mockResolvedValue('some-token')
})

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  jest.clearAllMocks()
  MockDate.reset()
})

describe('createAnonymousUserIfPossible tests', () => {
  it('does not create a new user when the user is unauthed and the user installed the extension not-too-recently', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(true)

    // User installed not-too-recently
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(55, 'seconds')
    )

    CreateNewUserMutation.mockImplementation(
      (
        environment,
        userId,
        email,
        referralData,
        experimentGroups,
        installId,
        installTime,
        onCompleted,
        onError
      ) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null,
          },
        })
      }
    )

    const {
      createAnonymousUserIfPossible,
    } = require('js/authentication/helpers')
    await createAnonymousUserIfPossible()

    expect(signInAnonymously).not.toHaveBeenCalled()
    expect(CreateNewUserMutation).not.toHaveBeenCalled()
  })

  it('does not create a new user when the user is unauthed and the user does not have an extension install time in local storage', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(true)

    // We don't know when the user installed
    getBrowserExtensionInstallTime.mockReturnValue(null)

    CreateNewUserMutation.mockImplementation(
      (
        environment,
        userId,
        email,
        referralData,
        experimentGroups,
        installId,
        installTime,
        onCompleted,
        onError
      ) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null,
          },
        })
      }
    )

    const {
      createAnonymousUserIfPossible,
    } = require('js/authentication/helpers')
    await createAnonymousUserIfPossible()

    expect(signInAnonymously).not.toHaveBeenCalled()
    expect(CreateNewUserMutation).not.toHaveBeenCalled()
  })

  it('creates a new user when the user is unauthed and the user installed very recently', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(true)

    // The user installed just now
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(28, 'seconds')
    )

    CreateNewUserMutation.mockImplementation(
      (
        environment,
        userId,
        email,
        referralData,
        experimentGroups,
        installId,
        installTime,
        onCompleted,
        onError
      ) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null,
          },
        })
      }
    )

    const {
      createAnonymousUserIfPossible,
    } = require('js/authentication/helpers')
    await createAnonymousUserIfPossible()

    expect(signInAnonymously).toHaveBeenCalledTimes(1)
    expect(CreateNewUserMutation).toHaveBeenCalledTimes(1)
  })

  it('returns null if we do not create an anonymous user', async () => {
    expect.assertions(1)
    setIfAnonymousUserIsAllowed(false) // not allowed
    CreateNewUserMutation.mockImplementation(
      (
        environment,
        userId,
        email,
        referralData,
        experimentGroups,
        installId,
        installTime,
        onCompleted,
        onError
      ) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null,
          },
        })
      }
    )

    const {
      createAnonymousUserIfPossible,
    } = require('js/authentication/helpers')
    const response = await createAnonymousUserIfPossible()
    expect(response).toBeNull()
  })

  it('returns the AuthUser object if we create a new user', async () => {
    expect.assertions(1)
    setIfAnonymousUserIsAllowed(true)
    const {
      createAnonymousUserIfPossible,
    } = require('js/authentication/helpers')
    const response = await createAnonymousUserIfPossible()

    // From authentication/user.js mock.
    expect(response).toEqual({
      id: 'abc123xyz789',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false,
    })
  })

  it('throws if anonymous sign-in fails', async () => {
    expect.assertions(1)
    setIfAnonymousUserIsAllowed(true)
    const mockErr = new Error('Yikes.')
    signInAnonymously.mockImplementationOnce(() => {
      throw mockErr
    })
    const {
      createAnonymousUserIfPossible,
    } = require('js/authentication/helpers')
    await expect(createAnonymousUserIfPossible()).rejects.toThrow(mockErr)
  })

  it('throws if server-side user creation fails', async () => {
    expect.assertions(1)
    setIfAnonymousUserIsAllowed(true)
    const mockErr = new Error('Yikes.')
    getUserToken.mockImplementationOnce(() => {
      throw mockErr
    })
    const {
      createAnonymousUserIfPossible,
    } = require('js/authentication/helpers')
    await expect(createAnonymousUserIfPossible()).rejects.toThrow(mockErr)
  })
})

describe('redirectToAuthIfNeeded tests', () => {
  it('[no-anon-allowed] does not redirect if the user is fully authenticated', () => {
    setIfAnonymousUserIsAllowed(false)

    const { redirectToAuthIfNeeded } = require('js/authentication/helpers')
    const authUser = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'foo',
      isAnonymous: false,
      emailVerified: true,
    }
    const redirected = redirectToAuthIfNeeded(authUser)
    expect(redirected).toBe(false)
    expect(goTo).not.toHaveBeenCalled()
    expect(replaceUrl).not.toHaveBeenCalled()
  })

  it('[anon] does not redirect when the user is anonymous and is allowed to be anonymous', () => {
    setIfAnonymousUserIsAllowed(true)

    const authUser = {
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false,
    }

    const { redirectToAuthIfNeeded } = require('js/authentication/helpers')
    const redirected = redirectToAuthIfNeeded(authUser)
    expect(redirected).toBe(false)
    expect(goToDashboard).not.toHaveBeenCalled()
    expect(goTo).not.toHaveBeenCalled()
    expect(replaceUrl).not.toHaveBeenCalled()
  })

  it('[anon] redirects to the main login page when the user is null', () => {
    setIfAnonymousUserIsAllowed(true)

    const authUser = null
    isInIframe.mockReturnValue(false)
    const { redirectToAuthIfNeeded } = require('js/authentication/helpers')
    const redirected = redirectToAuthIfNeeded(authUser)
    expect(redirected).toBe(true)
    expect(replaceUrl).toHaveBeenCalledWith(loginURL, {})
  })

  it('[no-anon-allowed] redirects to the sign-in view if the user is unauthed and NOT within an iframe', () => {
    setIfAnonymousUserIsAllowed(false)

    const authUser = {
      uid: null,
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false,
    }
    isInIframe.mockReturnValue(false)
    const { redirectToAuthIfNeeded } = require('js/authentication/helpers')
    const redirected = redirectToAuthIfNeeded(authUser)
    expect(replaceUrl).toHaveBeenCalledWith(loginURL, {})
    expect(redirected).toBe(true)
  })

  it('[no-anon-allowed] redirects to the sign-in message if the user is unauthed and within an iframe', () => {
    // Otherwise, the user is allowed to be anonymous.
    isAnonymousUserSignInEnabled.mockReturnValue(true)
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(2, 'minutes')
    )

    isInIframe.mockReturnValue(true)

    const authUser = {
      id: null,
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false,
    }

    const { redirectToAuthIfNeeded } = require('js/authentication/helpers')
    redirectToAuthIfNeeded(authUser)

    expect(replaceUrl).toHaveBeenCalledWith(authMessageURL, {})
  })

  it('redirects to the login screen if the user is anonymous but has been around long enough for us to ask them to sign in', () => {
    // This is longer than users are allowed to remain anonymous.
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(5, 'days')
    )

    // Otherwise, anonymous users are allowed.
    isAnonymousUserSignInEnabled.mockReturnValue(true)

    isInIframe.mockReturnValue(false)
    const authUser = {
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false,
    }
    const { redirectToAuthIfNeeded } = require('js/authentication/helpers')
    redirectToAuthIfNeeded(authUser)
    expect(replaceUrl).toHaveBeenCalledWith(loginURL, { mandatory: 'true' }) // includes URL param
  })

  it('does not redirect to the login screen if the user is anonymous and has been around less than the time needed for us to ask them to sign in', () => {
    // This is less than the max time users are allowed to remain anonymous.
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(3, 'days')
    )

    // Otherwise, anonymous users are allowed.
    isAnonymousUserSignInEnabled.mockReturnValue(true)

    isInIframe.mockReturnValue(false)
    const authUser = {
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false,
    }
    const { redirectToAuthIfNeeded } = require('js/authentication/helpers')
    redirectToAuthIfNeeded(authUser)
    expect(replaceUrl).not.toHaveBeenCalled()
  })

  it('[no-anon-allowed] redirects to missing email screen if authed and there is no email address', () => {
    setIfAnonymousUserIsAllowed(false)

    const { redirectToAuthIfNeeded } = require('js/authentication/helpers')
    const authUser = {
      id: 'abc123',
      email: null,
      username: 'foo',
      isAnonymous: false,
      emailVerified: false,
    }
    const redirected = redirectToAuthIfNeeded(authUser)
    expect(replaceUrl).toHaveBeenCalledWith(missingEmailMessageURL)
    expect(redirected).toBe(true)
  })

  it('[no-anon-allowed] redirects to email verification screen if authed and email is unverified', () => {
    setIfAnonymousUserIsAllowed(false)

    const { redirectToAuthIfNeeded } = require('js/authentication/helpers')
    const authUser = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: 'foo',
      isAnonymous: false,
      emailVerified: false,
    }
    const redirected = redirectToAuthIfNeeded(authUser)
    expect(replaceUrl).toHaveBeenCalledWith(verifyEmailURL)
    expect(redirected).toBe(true)
  })

  it('[no-anon-allowed] redirects to new username screen if authed and username is not set', () => {
    setIfAnonymousUserIsAllowed(false)

    const { redirectToAuthIfNeeded } = require('js/authentication/helpers')
    const authUser = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: true,
    }
    const redirected = redirectToAuthIfNeeded(authUser)
    expect(replaceUrl).toHaveBeenCalledWith(enterUsernameURL)
    expect(redirected).toBe(true)
  })

  it('[no-anon-allowed] sets the username in local storage and does not redirect if the username exists on the server but on locally', () => {
    setIfAnonymousUserIsAllowed(false)

    const { redirectToAuthIfNeeded } = require('js/authentication/helpers')
    const authUser = {
      id: 'abc123',
      email: 'foo@bar.com',
      username: null,
      isAnonymous: false,
      emailVerified: true,
    }
    const user = {
      username: 'MisterTee',
    }
    const redirected = redirectToAuthIfNeeded(authUser, user)
    expect(setUsernameInLocalStorage).toHaveBeenCalledWith('MisterTee')
    expect(replaceUrl).not.toHaveBeenCalled()
    expect(redirected).toBe(false)
  })
})

describe('createNewUser tests', () => {
  it('calls CreateNewUserMutation as expected', async () => {
    expect.assertions(1)
    getUserToken.mockResolvedValue('some-token')
    getReferralData.mockImplementationOnce(() => null)
    const mockUUID = '9359e548-1bd8-4bf1-9e10-09b5b6b4df34'
    getBrowserExtensionInstallId.mockReturnValueOnce(mockUUID)
    const mockExtensionInstallTime = '2018-08-18T01:12:59.187Z'
    getBrowserExtensionInstallTime.mockReturnValueOnce(mockExtensionInstallTime)
    getUserTestGroupsForMutation.mockReturnValueOnce({
      anonSignIn: 'ANONYMOUS_ALLOWED',
    })

    // Mock the authed user
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: false,
    })

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementationOnce(
      (
        environment,
        userId,
        email,
        referralData,
        experimentGroups,
        installId,
        installTime,
        onCompleted,
        onError
      ) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: 'somebody@example.com',
            username: null,
            justCreated: true,
          },
        })
      }
    )

    const createNewUser = require('js/authentication/helpers').createNewUser
    await createNewUser()

    expect(CreateNewUserMutation).toHaveBeenCalledWith(
      environment,
      'abc123',
      'somebody@example.com',
      null,
      { anonSignIn: 'ANONYMOUS_ALLOWED' },
      mockUUID,
      mockExtensionInstallTime,
      expect.any(Function),
      expect.any(Function)
    )
  })

  it('returns the new user data', async () => {
    expect.assertions(1)

    // Mock the authed user
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: false,
    })

    getUserToken.mockResolvedValue('some-token')
    getReferralData.mockImplementationOnce(() => null)

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementationOnce(
      (
        environment,
        userId,
        email,
        referralData,
        experimentGroups,
        installId,
        installTime,
        onCompleted,
        onError
      ) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: 'somebody@example.com',
            username: null,
            justCreated: true,
          },
        })
      }
    )

    const createNewUser = require('js/authentication/helpers').createNewUser
    const newUser = await createNewUser()

    expect(newUser).toEqual({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      justCreated: true,
    })
  })

  it('uses referral data when creating a new user', async () => {
    expect.assertions(1)
    getUserToken.mockResolvedValue('some-token')
    getReferralData.mockImplementationOnce(() => ({
      referringUser: 'asdf1234',
    }))

    // Mock the authed user
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: false,
    })

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementationOnce(
      (
        environment,
        userId,
        email,
        referralData,
        experimentGroups,
        installId,
        installTime,
        onCompleted,
        onError
      ) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: 'somebody@example.com',
            username: null,
            justCreated: true,
          },
        })
      }
    )

    const createNewUser = require('js/authentication/helpers').createNewUser
    await createNewUser()

    expect(CreateNewUserMutation.mock.calls[0][3]).toEqual({
      referringUser: 'asdf1234',
    })
  })

  it('passes the assigned experiment groups when creating a new user', async () => {
    expect.assertions(1)

    const experimentGroups = {
      anonSignIn: 'AUTHED_USER_ONLY',
    }
    getUserTestGroupsForMutation.mockReturnValueOnce(experimentGroups)
    getUserToken.mockResolvedValue('some-token')
    getReferralData.mockImplementationOnce(() => null)

    // Mock the authed user
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: false,
    })

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementationOnce(
      (
        environment,
        userId,
        email,
        referralData,
        experimentGroups,
        installId,
        installTime,
        onCompleted,
        onError
      ) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: 'somebody@example.com',
            username: null,
            justCreated: true,
          },
        })
      }
    )

    const createNewUser = require('js/authentication/helpers').createNewUser
    await createNewUser()

    expect(CreateNewUserMutation.mock.calls[0][4]).toEqual(experimentGroups)
  })

  it('force-refreshes the user token before calling to create the user', async () => {
    expect.assertions(2)

    // Mock the authed user
    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: false,
    })

    // Make getUserToken not resolve yet so we can confirm
    // the LogEmailVerifiedMutation has not yet been called.
    getUserToken.mockReturnValueOnce(new Promise(() => {}))
    getReferralData.mockImplementationOnce(() => null)

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementationOnce(
      (
        environment,
        userId,
        email,
        referralData,
        experimentGroups,
        installId,
        installTime,
        onCompleted,
        onError
      ) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: 'somebody@example.com',
            username: null,
            justCreated: true,
          },
        })
      }
    )

    const createNewUser = require('js/authentication/helpers').createNewUser
    createNewUser()
    await flushAllPromises()
    expect(getUserToken).toHaveBeenCalledWith(true)
    expect(CreateNewUserMutation).not.toHaveBeenCalled()
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
      emailVerified: true,
    })
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('js/authentication/helpers')
      .checkIfEmailVerified
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
      emailVerified: false,
    })
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('js/authentication/helpers')
      .checkIfEmailVerified
    const promise = checkIfEmailVerified()
    await runAsyncTimerLoops(25)
    const isVerified = await promise
    expect(isVerified).toBe(false)
  })

  it('returns false if the user is not authenticated', async () => {
    expect.assertions(1)

    getCurrentUser.mockResolvedValue(null)
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('js/authentication/helpers')
      .checkIfEmailVerified
    const promise = checkIfEmailVerified()
    await runAsyncTimerLoops(25)
    const isVerified = await promise
    expect(isVerified).toBe(false)
  })

  it('reloads the Firebase user a maximum of 16 times', async () => {
    expect.assertions(1)

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: false,
    })
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('js/authentication/helpers')
      .checkIfEmailVerified
    const promise = checkIfEmailVerified()
    await runAsyncTimerLoops(25)
    await promise
    expect(reloadUser).toHaveBeenCalledTimes(16)
  })

  it('returns true if the email is verified after refetching the Firebase user a few times', async () => {
    expect.assertions(1)

    getCurrentUser
      .mockResolvedValueOnce({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: false,
      })
      .mockResolvedValueOnce({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: false,
      })
      // Third fetch has emailVerified=true
      .mockResolvedValue({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: true,
      })
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('js/authentication/helpers')
      .checkIfEmailVerified
    const promise = checkIfEmailVerified()
    await runAsyncTimerLoops(25)
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
        emailVerified: false,
      })
      .mockResolvedValueOnce({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: false,
      })
      // Third fetch has emailVerified=true
      .mockResolvedValue({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: true,
      })
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('js/authentication/helpers')
      .checkIfEmailVerified
    const promise = checkIfEmailVerified()
    await runAsyncTimerLoops(25)
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
      emailVerified: true,
    })
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('js/authentication/helpers')
      .checkIfEmailVerified
    await checkIfEmailVerified()
    expect(LogEmailVerifiedMutation).toHaveBeenCalledWith(
      environment,
      'abc123',
      expect.any(Function),
      expect.any(Function)
    )
  })

  it('force-refreshes the user token before logging the email as verified', async () => {
    expect.assertions(2)

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: true,
    })
    reloadUser.mockImplementation(undefined)

    // Make getUserToken not resolve yet so we can confirm
    // the LogEmailVerifiedMutation has not yet been called.
    getUserToken.mockReturnValueOnce(new Promise(() => {}))

    const checkIfEmailVerified = require('js/authentication/helpers')
      .checkIfEmailVerified
    checkIfEmailVerified()
    await flushAllPromises()
    expect(getUserToken).toHaveBeenCalledWith(true)
    expect(LogEmailVerifiedMutation).not.toHaveBeenCalled()
  })

  it('logs an error if refreshing the user token throws an error', async done => {
    expect.assertions(2)

    getCurrentUser.mockResolvedValue({
      id: 'abc123',
      email: 'somebody@example.com',
      username: null,
      isAnonymous: false,
      emailVerified: true,
    })
    reloadUser.mockImplementation(undefined)
    const mockErr = new Error('Sigh.')
    getUserToken.mockRejectedValue(mockErr)

    const checkIfEmailVerified = require('js/authentication/helpers')
      .checkIfEmailVerified
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

  it('logs an error if reloading the Firebase user throws an error', async done => {
    expect.assertions(2)

    getCurrentUser
      .mockResolvedValueOnce({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: false,
      })
      .mockResolvedValue({
        id: 'abc123',
        email: 'somebody@example.com',
        username: null,
        isAnonymous: false,
        emailVerified: true,
      })
    const mockErr = new Error('Whoops!')
    reloadUser.mockRejectedValue(new Error('Whoops!'))
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('js/authentication/helpers')
      .checkIfEmailVerified
    checkIfEmailVerified()
      // Ignore expected error
      .catch(e => {})
      .finally(() => {
        expect(logger.error).toHaveBeenCalledTimes(1)
        expect(logger.error).toHaveBeenCalledWith(mockErr)
        done()
      })
    await runAsyncTimerLoops(25)
  })

  it('logs an error if getting the user throws an error', async done => {
    expect.assertions(2)

    const mockErr = new Error('Uh oh.')
    getCurrentUser.mockRejectedValue(mockErr)
    reloadUser.mockRejectedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('js/authentication/helpers')
      .checkIfEmailVerified
    checkIfEmailVerified()
      // Ignore expected error
      .catch(e => {})
      .finally(() => {
        expect(logger.error).toHaveBeenCalledTimes(1)
        expect(logger.error).toHaveBeenCalledWith(mockErr)
        done()
      })
    await runAsyncTimerLoops(25)
  })
})
