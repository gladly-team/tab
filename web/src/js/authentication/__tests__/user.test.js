/* eslint-env jest */

import { STORAGE_KEY_USERNAME } from 'js/constants'
import {
  absoluteUrl,
  accountURL,
  constructUrl,
  enterUsernameURL,
} from 'js/navigation/navigation'

jest.mock('jose', () => ({
  SignJWT: class {
    setProtectedHeader() {
      return {
        sign: () => 'faketoken',
      }
    }
  },
}))

jest.mock('js/utils/localstorage-mgr')
jest.mock('js/mutations/DeleteUserMutation')

const storedMockDevAuthenticationEnvVar =
  process.env.REACT_APP_MOCK_DEV_AUTHENTICATION
const storedNodeEnvVar = process.env.NODE_ENV

afterEach(() => {
  jest.clearAllMocks()

  const localStorageMgr = require('js/utils/localstorage-mgr').default
  localStorageMgr.clear()

  // Reset env vars and modules
  process.env.REACT_APP_MOCK_DEV_AUTHENTICATION = storedMockDevAuthenticationEnvVar
  process.env.NODE_ENV = storedNodeEnvVar
  jest.resetModules()
})

describe('getUsername tests', () => {
  it('fetches the username from localStorage', () => {
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'BobMIII')
    const getUsername = require('js/authentication/user').getUsername
    expect(getUsername()).toBe('BobMIII')
  })
})

describe('setUsername tests', () => {
  it('works as expected', () => {
    const setUsernameInLocalStorage = require('js/authentication/user')
      .setUsernameInLocalStorage
    setUsernameInLocalStorage('MichaelC')
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    expect(localStorageMgr.getItem(STORAGE_KEY_USERNAME)).toBe('MichaelC')
  })
})

describe('getCurrentUser tests', () => {
  it('returns a user when one exists', async () => {
    expect.assertions(1)

    // formatUser gets the username from localStorage.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'RGates')

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
    })

    const getCurrentUser = require('js/authentication/user').getCurrentUser
    const currentUser = await getCurrentUser()
    expect(currentUser).toEqual({
      id: 'xyz987',
      email: 'foo@example.com',
      username: 'RGates',
      isAnonymous: false,
      emailVerified: true,
    })
  })

  it('returns null when a user does not exist', async () => {
    expect.assertions(1)

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser(null)

    const getCurrentUser = require('js/authentication/user').getCurrentUser
    const currentUser = await getCurrentUser()
    expect(currentUser).toBeNull()
  })

  it('returns a mock user when using mock authentication in development', async () => {
    expect.assertions(1)

    // formatUser gets the username from localStorage.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'SomeUsername')

    // Set development env vars.
    process.env.REACT_APP_MOCK_DEV_AUTHENTICATION = 'true'
    process.env.NODE_ENV = 'development'

    const getCurrentUser = require('js/authentication/user').getCurrentUser
    const currentUser = await getCurrentUser()
    expect(currentUser).toEqual({
      id: 'abcdefghijklmno',
      email: 'kevin@example.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true,
    })
  })

  it('unsubscribes the Firebase onAuthStateChanged listener after using it once', done => {
    expect.assertions(1)

    // formatUser gets the username from localStorage.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'RGates')

    const {
      __setOnAuthStateChangeUnsubscribeFunction,
      __setFirebaseUser,
    } = require('firebase/app')

    const mockAuthUnsubscribeFunc = jest.fn(() => {
      expect(true).toBe(true)
      done()
    })
    __setOnAuthStateChangeUnsubscribeFunction(mockAuthUnsubscribeFunc)
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
    })

    const getCurrentUser = require('js/authentication/user').getCurrentUser
    getCurrentUser()
  })

  it('does not throw if the Firebase onAuthStateChanged unsubscribe function is not a function for some reason', async () => {
    expect.assertions(0)

    // formatUser gets the username from localStorage.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'RGates')

    const {
      __setOnAuthStateChangeUnsubscribeFunction,
      __setFirebaseUser,
    } = require('firebase/app')

    const mockAuthUnsubscribeFunc = undefined
    __setOnAuthStateChangeUnsubscribeFunction(mockAuthUnsubscribeFunc)
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
    })

    const getCurrentUser = require('js/authentication/user').getCurrentUser
    await getCurrentUser()
  })
})

describe('onAuthStateChanged tests', () => {
  it('calls listeners with the Firebase user object when the auth state changes', done => {
    // formatUser gets the username from localStorage.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'DoraSplora')

    const { onAuthStateChanged } = require('js/authentication/user')
    onAuthStateChanged(currentUser => {
      expect(currentUser).toMatchObject({
        id: 'xyz987',
        email: 'foo@example.com',
        username: 'DoraSplora',
        isAnonymous: false,
        emailVerified: true,
      })
      done()
    })

    const __triggerAuthStateChange = require('firebase/app')
      .__triggerAuthStateChange
    __triggerAuthStateChange({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
    })
  })

  it('returns a mock user when using mock authentication in development', done => {
    // Set development env vars.
    process.env.REACT_APP_MOCK_DEV_AUTHENTICATION = 'true'
    process.env.NODE_ENV = 'development'

    // formatUser gets the username from localStorage.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'kevin')

    const { onAuthStateChanged } = require('js/authentication/user')
    onAuthStateChanged(currentUser => {
      expect(currentUser).toMatchObject({
        id: 'abcdefghijklmno',
        email: 'kevin@example.com',
        username: 'kevin',
        isAnonymous: false,
        emailVerified: true,
      })
      done()
    })

    const __triggerAuthStateChange = require('firebase/app')
      .__triggerAuthStateChange
    __triggerAuthStateChange(null)
  })
})

describe('getUserToken tests', () => {
  it('returns a token when a user exists', async () => {
    expect.assertions(1)

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
    })

    const getUserToken = require('js/authentication/user').getUserToken
    const token = await getUserToken()
    expect(token).toEqual('fake-token-123')
  })

  it('returns null when there is no user', async () => {
    expect.assertions(1)

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser(null)

    const getUserToken = require('js/authentication/user').getUserToken
    const token = await getUserToken()
    expect(token).toBeNull()
  })
})

describe('logout tests', () => {
  it("calls Firebase's sign out method", async () => {
    expect.assertions(1)
    const firebase = require('firebase/app')
    const logout = require('js/authentication/user').logout
    await logout()
    expect(firebase.auth().signOut).toHaveBeenCalledTimes(1)
  })
})

describe('getUserToken tests', () => {
  it('forces a refetch when called with forceRefetch=true', async () => {
    expect.assertions(1)

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    const mockFirebaseGetIdToken = jest.fn()
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: mockFirebaseGetIdToken,
    })

    const getUserToken = require('js/authentication/user').getUserToken
    await getUserToken(true)
    expect(mockFirebaseGetIdToken).toHaveBeenCalledWith(true)
  })

  it('does not force a refetch by default', async () => {
    expect.assertions(1)

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    const mockFirebaseGetIdToken = jest.fn()
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: mockFirebaseGetIdToken,
    })

    const getUserToken = require('js/authentication/user').getUserToken
    await getUserToken()
    expect(mockFirebaseGetIdToken).toHaveBeenCalledWith(undefined)
  })

  it('removes some localStorage items on logout', async () => {
    expect.assertions(15)
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    const logout = require('js/authentication/user').logout
    await logout()
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith('tab.user.username')
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.date'
    )
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.count'
    )
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith(
      'tab.clientLocation.countryIsoCode'
    )
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith(
      'tab.clientLocation.isInEU'
    )
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith(
      'tab.clientLocation.queryTime'
    )
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith(
      'tab.referralData.referringUser'
    )
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith(
      'tab.referralData.referringChannel'
    )
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith(
      'tab.consentData.newConsentDataExists'
    )
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith(
      'tab.newUser.hasCompletedTour'
    )
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith(
      'tab.newUser.extensionInstallId'
    )
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith(
      'tab.newUser.approxInstallTime'
    )
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith(
      'tab.experiments.anonUser'
    )
    expect(localStorageMgr.removeItem).toHaveBeenCalledWith(
      'tab.newUser.isTabV4Enabled'
    )
    expect(localStorageMgr.removeItem).toHaveBeenCalledTimes(14)
  })
})

describe('sendVerificationEmail tests', () => {
  it('works as expected', async () => {
    expect.assertions(2)
    const mockSendEmailVerification = jest.fn(() => Promise.resolve())

    // A user must exist to be able to send a verification email.
    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
      sendEmailVerification: mockSendEmailVerification,
    })

    const sendVerificationEmail = require('js/authentication/user')
      .sendVerificationEmail
    const response = await sendVerificationEmail()
    expect(mockSendEmailVerification).toHaveBeenCalledTimes(1)
    expect(response).toBe(true)
  })

  it('uses the "enterUsernameURL" for Tab for a Cause as the default "continueURL"', async () => {
    expect.assertions(1)
    const mockSendEmailVerification = jest.fn(() => Promise.resolve())

    // A user must exist to be able to send a verification email.
    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
      sendEmailVerification: mockSendEmailVerification,
    })

    const sendVerificationEmail = require('js/authentication/user')
      .sendVerificationEmail
    await sendVerificationEmail()
    expect(mockSendEmailVerification).toHaveBeenCalledWith({
      // Make sure post-verification page redirect is correct.
      url: absoluteUrl(enterUsernameURL),
    })
  })

  it('accepts a custom "continueURL"', async () => {
    expect.assertions(1)
    const mockSendEmailVerification = jest.fn(() => Promise.resolve())

    // A user must exist to be able to send a verification email.
    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
      sendEmailVerification: mockSendEmailVerification,
    })

    const sendVerificationEmail = require('js/authentication/user')
      .sendVerificationEmail
    await sendVerificationEmail({
      continueURL: 'https://example.com/some/thing/',
    })
    expect(mockSendEmailVerification).toHaveBeenCalledWith({
      url: absoluteUrl('https://example.com/some/thing/'),
    })
  })

  it('fails if no user exists', async () => {
    expect.assertions(2)
    const mockSendEmailVerification = jest.fn(() => Promise.resolve())

    // Suppress expected error message.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser(null)

    const sendVerificationEmail = require('js/authentication/user')
      .sendVerificationEmail
    const response = await sendVerificationEmail()
    expect(mockSendEmailVerification).not.toHaveBeenCalled()
    expect(response).toBe(false)
  })

  it('fails gracefully if Firebase throws an error when sending an email', async () => {
    expect.assertions(1)

    // Mock an error
    const mockSendEmailVerification = jest.fn(() => {
      throw new Error('Apocalyptic email failure!')
    })

    // Suppress expected error message.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    // A user must exist to be able to send a verification email.
    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
      sendEmailVerification: mockSendEmailVerification,
    })

    const sendVerificationEmail = require('js/authentication/user')
      .sendVerificationEmail
    const response = await sendVerificationEmail()
    expect(response).toBe(false)
  })
})

describe('signInAnonymously tests', () => {
  it('works as expected', async () => {
    expect.assertions(1)

    // formatUser gets the username from localStorage.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'SomeUsername')

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser({
      uid: 'xyz987',
      email: null,
      isAnonymous: true,
      emailVerified: false,
      getIdToken: jest.fn(() => 'fake-token-123'),
    })
    const signInAnonymously = require('js/authentication/user')
      .signInAnonymously
    const response = await signInAnonymously()
    expect(response).toMatchObject({
      id: 'xyz987',
      email: null,
      isAnonymous: true,
      emailVerified: false,
      username: 'SomeUsername',
    })
  })
})

describe('reloadUser tests', () => {
  it('works as expected when the user exists', async () => {
    expect.assertions(1)

    // formatUser gets the username from localStorage.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'Shorty')

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    const mockReload = jest.fn()
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
      reload: mockReload,
    })

    const reloadUser = require('js/authentication/user').reloadUser
    await reloadUser()
    expect(mockReload).toHaveBeenCalledTimes(1)
  })

  it('does not error when the user does not exist', async () => {
    expect.assertions(1)

    // formatUser gets the username from localStorage.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'Shorty')

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    const mockReload = jest.fn()
    __setFirebaseUser(null)

    const reloadUser = require('js/authentication/user').reloadUser
    await reloadUser()
    expect(mockReload).not.toHaveBeenCalled()
  })
})

describe('updateUserEmail tests', () => {
  it('works as expected', async () => {
    expect.assertions(2)
    const mockVerifyBeforeUpdateEmail = jest.fn(() => Promise.resolve())

    // A user must exist to be able to send a verification email.
    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
      verifyBeforeUpdateEmail: mockVerifyBeforeUpdateEmail,
    })

    const updateUserEmail = require('js/authentication/user').updateUserEmail
    const response = await updateUserEmail('test@gmail.com')
    expect(mockVerifyBeforeUpdateEmail).toHaveBeenCalledTimes(1)
    expect(response).toBe(undefined)
  })

  it('uses the "accountURL" for Tab for a Cause as the default "continueURL"', async () => {
    const mockVerifyBeforeUpdateEmail = jest.fn(() => Promise.resolve())

    // A user must exist to be able to send a verification email.
    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
      verifyBeforeUpdateEmail: mockVerifyBeforeUpdateEmail,
    })

    const email = 'test@gmail.com'
    const updateUserEmail = require('js/authentication/user').updateUserEmail
    await updateUserEmail(email)

    expect(mockVerifyBeforeUpdateEmail).toHaveBeenCalledWith(email, {
      url: constructUrl('/newtab/auth/', { next: 3 }, { absolute: true }),
    })
  })
})

describe('deleteUser tests', () => {
  it('works as expected', async () => {
    expect.assertions(3)

    const mockDeleteUser = jest.fn(() => Promise.resolve())

    // A user must exist to be able to send a verification email.
    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
      delete: mockDeleteUser,
    })

    const DeleteUserMutation = require('js/mutations/DeleteUserMutation')
      .default
    DeleteUserMutation.mockImplementationOnce((env, userid, callback) =>
      callback()
    )

    const deleteUser = require('js/authentication/user').deleteUser
    const response = await deleteUser()

    expect(DeleteUserMutation).toHaveBeenCalled()
    expect(mockDeleteUser).toHaveBeenCalled()
    expect(response).toBe(true)
  })
})
