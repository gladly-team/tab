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
  verifyEmailURL
} from 'js/navigation/navigation'
import {
  getReferralData,
  isInIframe
} from 'web-utils'
import CreateNewUserMutation from 'js/mutations/CreateNewUserMutation'
import LogEmailVerifiedMutation from 'js/mutations/LogEmailVerifiedMutation'
import {
  getUserToken,
  getCurrentUser,
  reloadUser,
  signInAnonymously
} from 'authentication/user'
import {
  flushAllPromises,
  runAsyncTimerLoops
} from 'utils/test-utils'
import logger from 'utils/logger'
import {
  getAnonymousUserTestGroup,
  getUserTestGroupsForMutation
} from 'utils/experiments'
import {
  getBrowserExtensionInstallId,
  getBrowserExtensionInstallTime
} from 'utils/local-user-data-mgr'
import {
  isAnonymousUserSignInEnabled
} from 'utils/feature-flags'

jest.mock('authentication/user')
jest.mock('js/navigation/navigation')
jest.mock('utils/localstorage-mgr')
jest.mock('web-utils')
jest.mock('js/mutations/CreateNewUserMutation')
jest.mock('js/mutations/LogEmailVerifiedMutation')
jest.mock('authentication/user')
jest.mock('../../../relay-env')
jest.mock('utils/logger')
jest.mock('utils/experiments')
jest.mock('utils/local-user-data-mgr')
jest.mock('utils/feature-flags')

const mockNow = '2017-05-19T13:59:58.000Z'

const setIfAnonymousUserIsAllowed = (allow) => {
  // Set the mocked return values that will allow or
  // or disallow the user to be anonymous.
  if (allow) {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(2, 'minutes'))
    isAnonymousUserSignInEnabled.mockReturnValue(true)
    getAnonymousUserTestGroup.mockReturnValue('unauthed')
  } else {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(23, 'days'))
    isAnonymousUserSignInEnabled.mockReturnValue(false)
    getAnonymousUserTestGroup.mockReturnValue('none')
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

describe('checkAuthStateAndRedirectIfNeeded tests', () => {
  it('[no-anon-allowed] does not redirect if the user is fully authenticated', async () => {
    expect.assertions(3)
    setIfAnonymousUserIsAllowed(false)

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
    expect(goTo).not.toHaveBeenCalled()
    expect(replaceUrl).not.toHaveBeenCalled()
  })

  it('[anon] does not redirect when the user is anonymous and is allowed to be anonymous', async () => {
    expect.assertions(4)
    setIfAnonymousUserIsAllowed(true)

    const user = {
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false
    }

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const redirected = await checkAuthStateAndRedirectIfNeeded(user)

    expect(redirected).toBe(false)
    expect(goToDashboard).not.toHaveBeenCalled()
    expect(goTo).not.toHaveBeenCalled()
    expect(replaceUrl).not.toHaveBeenCalled()
  })

  it('[anon] does not create a new user when the user is unauthed and the user installed the extension not-too-recently', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(true)

    // User installed not-too-recently
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(55, 'seconds'))

    const user = {
      id: null,
      email: null,
      username: null,
      isAnonymous: null,
      emailVerified: false
    }
    isInIframe.mockReturnValue(false)

    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, experimentGroups, installId,
        installTime, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    await checkAuthStateAndRedirectIfNeeded(user)

    expect(signInAnonymously).not.toHaveBeenCalled()
    expect(CreateNewUserMutation).not.toHaveBeenCalled()
  })

  it('[anon] does not create a new user when the user is unauthed and the user does not have an extension install time in local storage', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(true)

    // We don't know when the user installed
    getBrowserExtensionInstallTime.mockReturnValue(null)

    const user = {
      id: null,
      email: null,
      username: null,
      isAnonymous: null,
      emailVerified: false
    }
    isInIframe.mockReturnValue(false)

    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, experimentGroups, installId,
        installTime, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    await checkAuthStateAndRedirectIfNeeded(user)

    expect(signInAnonymously).not.toHaveBeenCalled()
    expect(CreateNewUserMutation).not.toHaveBeenCalled()
  })

  it('[anon] creates a new user when the user is unauthed and the user installed very recently', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(true)

    // The user installed just now
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(28, 'seconds'))

    const user = {
      id: null,
      email: null,
      username: null,
      isAnonymous: null,
      emailVerified: false
    }
    isInIframe.mockReturnValue(false)

    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, experimentGroups, installId,
        installTime, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    await checkAuthStateAndRedirectIfNeeded(user)

    expect(signInAnonymously).toHaveBeenCalledTimes(1)
    expect(CreateNewUserMutation).toHaveBeenCalledTimes(1)
  })

  it('[anon] redirects when the user is unauthed and the user installed the extension not-too-recently', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(true)

    // User installed not-too-recently
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(55, 'seconds'))

    const user = {
      id: null,
      email: null,
      username: null,
      isAnonymous: null,
      emailVerified: false
    }
    isInIframe.mockReturnValue(false)

    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, experimentGroups, installId,
        installTime, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const redirected = await checkAuthStateAndRedirectIfNeeded(user)

    expect(redirected).toBe(true)
    expect(replaceUrl).toHaveBeenCalledWith(loginURL, {})
  })

  it('[anon] redirects when the user is unauthed and the user does not have an extension install time in local storage', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(true)

    // We don't know when the user installed
    getBrowserExtensionInstallTime.mockReturnValue(null)

    const user = {
      id: null,
      email: null,
      username: null,
      isAnonymous: null,
      emailVerified: false
    }
    isInIframe.mockReturnValue(false)

    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, experimentGroups, installId,
        installTime, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const redirected = await checkAuthStateAndRedirectIfNeeded(user)

    expect(redirected).toBe(true)
    expect(replaceUrl).toHaveBeenCalledWith(loginURL, {})
  })

  it('[anon] does not redirect when the user is unauthed and the user installed very recently', async () => {
    expect.assertions(4)
    setIfAnonymousUserIsAllowed(true)

    // The user installed just now
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(28, 'seconds'))

    const user = {
      id: null,
      email: null,
      username: null,
      isAnonymous: null,
      emailVerified: false
    }
    isInIframe.mockReturnValue(false)

    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, experimentGroups, installId,
        installTime, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const redirected = await checkAuthStateAndRedirectIfNeeded(user)

    expect(redirected).toBe(false)
    expect(goToDashboard).not.toHaveBeenCalled()
    expect(goTo).not.toHaveBeenCalled()
    expect(replaceUrl).not.toHaveBeenCalled()
  })

  it('[no-anon-allowed] redirects to the sign-in view if the user is unauthed and NOT within an iframe', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(false)

    const user = {
      uid: null,
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false
    }

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, experimentGroups, installId,
        installTime, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    isInIframe.mockReturnValue(false)

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    const redirected = await checkAuthStateAndRedirectIfNeeded(user)

    expect(replaceUrl).toHaveBeenCalledWith(loginURL, {})
    expect(redirected).toBe(true)
  })

  it('[no-anon-allowed] redirects to the sign-in message if the user is unauthed and within an iframe', async () => {
    expect.assertions(1)

    // The user is still be required to sign in.
    getAnonymousUserTestGroup.mockReturnValue('auth')

    // Otherwise, the user is allowed to be anonymous.
    isAnonymousUserSignInEnabled.mockReturnValue(true)
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(2, 'minutes'))

    isInIframe.mockReturnValue(true)

    const user = {
      id: null,
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false
    }

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    await checkAuthStateAndRedirectIfNeeded(user)

    expect(replaceUrl).toHaveBeenCalledWith(authMessageURL, {})
  })

  it('[no-anon-allowed] still creates an anonymous user before requiring sign-in', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(false)

    // The user installed just now
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(28, 'seconds'))

    const user = {
      uid: null,
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false
    }

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementation(
      (environment, userId, email, referralData, experimentGroups, installId,
        installTime, onCompleted, onError) => {
        onCompleted({
          createNewUser: {
            id: 'abc123',
            email: null,
            username: null
          }
        })
      }
    )

    isInIframe.mockReturnValue(false)

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    await checkAuthStateAndRedirectIfNeeded(user)

    expect(signInAnonymously).toHaveBeenCalledTimes(1)
    expect(CreateNewUserMutation).toHaveBeenCalledTimes(1)
  })

  it('redirects to the login screen if the user is anonymous but has been around long enough for us to ask them to sign in', async () => {
    expect.assertions(1)

    // This is longer than users are allowed to remain anonymous.
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(4, 'days'))

    // Otherwise, anonymous users are allowed.
    isAnonymousUserSignInEnabled.mockReturnValue(true)
    getAnonymousUserTestGroup.mockReturnValue('unauthed')

    isInIframe.mockReturnValue(false)

    const user = {
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false
    }

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    await checkAuthStateAndRedirectIfNeeded(user)

    expect(replaceUrl)
      .toHaveBeenCalledWith(loginURL, { mandatory: 'true' }) // includes URL param
  })

  it('does not redirect to the login screen if the user is anonymous and has been around less than the time needed for us to ask them to sign in', async () => {
    expect.assertions(1)

    // This is less than the max time users are allowed to remain anonymous.
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(1, 'days'))

    // Otherwise, anonymous users are allowed.
    isAnonymousUserSignInEnabled.mockReturnValue(true)
    getAnonymousUserTestGroup.mockReturnValue('unauthed')

    isInIframe.mockReturnValue(false)

    const user = {
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false
    }

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    await checkAuthStateAndRedirectIfNeeded(user)

    expect(replaceUrl).not.toHaveBeenCalled()
  })

  it('redirects to the login screen if the user is anonymous but is not in the anonymous sign-up experimental group', async () => {
    expect.assertions(1)

    // The user is still be required to sign in.
    getAnonymousUserTestGroup.mockReturnValue('auth')

    // Otherwise, the user is allowed to be anonymous.
    isAnonymousUserSignInEnabled.mockReturnValue(true)
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(2, 'minutes'))

    isInIframe.mockReturnValue(false)

    const user = {
      id: 'abc123',
      email: null,
      username: null,
      isAnonymous: true,
      emailVerified: false
    }

    const checkAuthStateAndRedirectIfNeeded = require('../helpers')
      .checkAuthStateAndRedirectIfNeeded
    await checkAuthStateAndRedirectIfNeeded(user)

    expect(replaceUrl).toHaveBeenCalledWith(loginURL, {})
  })

  it('[no-anon-allowed] redirects to missing email screen if authed and there is no email address', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(false)

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

  it('[no-anon-allowed] redirects to email verification screen if authed and email is unverified', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(false)

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

  it('[no-anon-allowed] redirects to new username screen if authed and username is not set', async () => {
    expect.assertions(2)
    setIfAnonymousUserIsAllowed(false)

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

  it('[no-anon-allowed] does not redirect to the new username screen if the username exists on the server', async () => {
    expect.assertions(1)
    setIfAnonymousUserIsAllowed(false)

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
  it('calls CreateNewUserMutation as expected', async () => {
    expect.assertions(1)
    getUserToken.mockResolvedValue('some-token')
    getReferralData.mockImplementationOnce(() => null)
    const mockUUID = '9359e548-1bd8-4bf1-9e10-09b5b6b4df34'
    getBrowserExtensionInstallId.mockReturnValueOnce(mockUUID)
    const mockExtensionInstallTime = '2018-08-18T01:12:59.187Z'
    getBrowserExtensionInstallTime.mockReturnValueOnce(mockExtensionInstallTime)
    getUserTestGroupsForMutation.mockReturnValueOnce({
      anonSignIn: 'ANONYMOUS_ALLOWED'
    })

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
      (environment, userId, email, referralData, experimentGroups, installId,
        installTime, onCompleted, onError) => {
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
    await createNewUser()

    expect(CreateNewUserMutation)
      .toHaveBeenCalledWith({}, 'abc123', 'somebody@example.com', null,
        { anonSignIn: 'ANONYMOUS_ALLOWED' }, mockUUID, mockExtensionInstallTime,
        expect.any(Function), expect.any(Function))
  })

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

    getUserToken.mockResolvedValue('some-token')
    getReferralData.mockImplementationOnce(() => null)

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementationOnce(
      (environment, userId, email, referralData, experimentGroups, installId,
        installTime, onCompleted, onError) => {
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
    getUserToken.mockResolvedValue('some-token')
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
      (environment, userId, email, referralData, experimentGroups, installId,
        installTime, onCompleted, onError) => {
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
    await createNewUser()

    expect(CreateNewUserMutation.mock.calls[0][3]).toEqual({
      referringUser: 'asdf1234'
    })
  })

  it('passes the assigned experiment groups when creating a new user', async () => {
    expect.assertions(1)

    const experimentGroups = {
      anonSignIn: 'AUTHED_USER_ONLY'
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
      emailVerified: false
    })

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementationOnce(
      (environment, userId, email, referralData, experimentGroups, installId,
        installTime, onCompleted, onError) => {
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
      emailVerified: false
    })

    // Make getUserToken not resolve yet so we can confirm
    // the LogEmailVerifiedMutation has not yet been called.
    getUserToken.mockReturnValueOnce(new Promise(() => {}))
    getReferralData.mockImplementationOnce(() => null)

    // Mock a response from new user creation
    CreateNewUserMutation.mockImplementationOnce(
      (environment, userId, email, referralData, experimentGroups, installId,
        installTime, onCompleted, onError) => {
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
    await runAsyncTimerLoops(25)
    const isVerified = await promise
    expect(isVerified).toBe(false)
  })

  it('returns false if the user is not authenticated', async () => {
    expect.assertions(1)

    getCurrentUser.mockResolvedValue(null)
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('../helpers').checkIfEmailVerified
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
      emailVerified: false
    })
    reloadUser.mockResolvedValue(undefined)
    getUserToken.mockResolvedValue('some-token')

    const checkIfEmailVerified = require('../helpers').checkIfEmailVerified
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
    await runAsyncTimerLoops(25)
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
    await runAsyncTimerLoops(25)
  })
})
