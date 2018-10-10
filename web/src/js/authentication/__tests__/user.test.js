/* eslint-env jest */

import {
  STORAGE_KEY_USERNAME
} from 'js/constants'
import {
  absoluteUrl,
  enterUsernameURL
} from 'js/navigation/navigation'

jest.mock('js/utils/localstorage-mgr')

const storedMockDevAuthenticationEnvVar = process.env.MOCK_DEV_AUTHENTICATION
const storedNodeEnvVar = process.env.NODE_ENV

afterEach(() => {
  jest.clearAllMocks()

  const localStorageMgr = require('js/utils/localstorage-mgr').default
  localStorageMgr.clear()

  // Reset env vars and modules
  process.env.MOCK_DEV_AUTHENTICATION = storedMockDevAuthenticationEnvVar
  process.env.NODE_ENV = storedNodeEnvVar
  jest.resetModules()
})

describe('authentication user module tests', () => {
  test('getUsername fetches the username from localStorage', () => {
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'BobMIII')
    const getUsername = require('js/authentication/user').getUsername
    expect(getUsername()).toBe('BobMIII')
  })

  test('setUsernameInLocalStorage works as expected', () => {
    const setUsernameInLocalStorage = require('js/authentication/user').setUsernameInLocalStorage
    setUsernameInLocalStorage('MichaelC')
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    expect(localStorageMgr.getItem(STORAGE_KEY_USERNAME)).toBe('MichaelC')
  })

  test('formatUser works as expected', () => {
    // formatUser gets the username from localStorage.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'PaulM')

    const formatUser = require('js/authentication/user').formatUser
    const firebaseUser = {
      uid: 'abc123',
      email: 'ostrichcoat@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123')
    }
    expect(formatUser(firebaseUser)).toEqual({
      id: 'abc123',
      email: 'ostrichcoat@example.com',
      username: 'PaulM',
      isAnonymous: false,
      emailVerified: true
    })
  })

  test('getCurrentUser returns a user when one exists', async () => {
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
      getIdToken: jest.fn(() => 'fake-token-123')
    })

    const getCurrentUser = require('js/authentication/user').getCurrentUser
    const currentUser = await getCurrentUser()
    expect(currentUser).toEqual({
      id: 'xyz987',
      email: 'foo@example.com',
      username: 'RGates',
      isAnonymous: false,
      emailVerified: true
    })
  })

  test('getCurrentUser returns null when a user does not exist', async () => {
    expect.assertions(1)

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser(null)

    const getCurrentUser = require('js/authentication/user').getCurrentUser
    const currentUser = await getCurrentUser()
    expect(currentUser).toBeNull()
  })

  test('getCurrentUser returns a mock user when using mock authentication in development', async () => {
    expect.assertions(1)

    // formatUser gets the username from localStorage.
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'SomeUsername')

    // Set development env vars.
    process.env.MOCK_DEV_AUTHENTICATION = 'true'
    process.env.NODE_ENV = 'development'

    const getCurrentUser = require('js/authentication/user').getCurrentUser
    const currentUser = await getCurrentUser()
    expect(currentUser).toEqual({
      id: 'abcdefghijklmno',
      email: 'kevin@example.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true
    })
  })

  test('getCurrentUserListener calls listeners with the Firebase user object when the auth state changes', done => {
    const getCurrentUserListener = require('js/authentication/user').getCurrentUserListener
    getCurrentUserListener().onAuthStateChanged(currentUser => {
      expect(currentUser).toMatchObject({
        uid: 'xyz987',
        email: 'foo@example.com',
        isAnonymous: false,
        emailVerified: true
        // Will also have getIdToken method.
      })
      done()
    })

    const __triggerAuthStateChange = require('firebase/app').__triggerAuthStateChange
    __triggerAuthStateChange({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123')
    })
  })

  test('getCurrentUserListener returns a mock user when using mock authentication in development', done => {
    // Set development env vars.
    process.env.MOCK_DEV_AUTHENTICATION = 'true'
    process.env.NODE_ENV = 'development'

    const getCurrentUserListener = require('js/authentication/user').getCurrentUserListener
    getCurrentUserListener().onAuthStateChanged(currentUser => {
      expect(currentUser).toMatchObject({
        uid: 'abcdefghijklmno',
        email: 'kevin@example.com',
        isAnonymous: false,
        emailVerified: true
        // Will also have getIdToken method.
      })
      done()
    })
  })

  test('getUserToken returns a token when a user exists', async () => {
    expect.assertions(1)

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123')
    })

    const getUserToken = require('js/authentication/user').getUserToken
    const token = await getUserToken()
    expect(token).toEqual('fake-token-123')
  })

  test('getUserToken returns null when there is no user', async () => {
    expect.assertions(1)

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser(null)

    const getUserToken = require('js/authentication/user').getUserToken
    const token = await getUserToken()
    expect(token).toBeNull()
  })

  test('logout calls Firebase\'s sign out method', async () => {
    expect.assertions(1)
    const firebase = require('firebase/app')
    const logout = require('js/authentication/user').logout
    await logout()
    expect(firebase.auth().signOut).toHaveBeenCalledTimes(1)
  })

  test('getUserToken forces a refetch when called with forceRefetch=true', async () => {
    expect.assertions(1)

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    const mockFirebaseGetIdToken = jest.fn()
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: mockFirebaseGetIdToken
    })

    const getUserToken = require('js/authentication/user').getUserToken
    await getUserToken(true)
    expect(mockFirebaseGetIdToken).toHaveBeenCalledWith(true)
  })

  test('getUserToken does not force a refetch by default', async () => {
    expect.assertions(1)

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    const mockFirebaseGetIdToken = jest.fn()
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: mockFirebaseGetIdToken
    })

    const getUserToken = require('js/authentication/user').getUserToken
    await getUserToken()
    expect(mockFirebaseGetIdToken).toHaveBeenCalledWith(undefined)
  })

  test('removes some localStorage items on logout', async () => {
    expect.assertions(14)
    const localStorageMgr = require('js/utils/localstorage-mgr').default
    const logout = require('js/authentication/user').logout
    await logout()
    expect(localStorageMgr.removeItem)
      .toHaveBeenCalledWith('tab.user.username')
    expect(localStorageMgr.removeItem)
      .toHaveBeenCalledWith('tab.user.lastTabDay.date')
    expect(localStorageMgr.removeItem)
      .toHaveBeenCalledWith('tab.user.lastTabDay.count')
    expect(localStorageMgr.removeItem)
      .toHaveBeenCalledWith('tab.clientLocation.countryIsoCode')
    expect(localStorageMgr.removeItem)
      .toHaveBeenCalledWith('tab.clientLocation.isInEU')
    expect(localStorageMgr.removeItem)
      .toHaveBeenCalledWith('tab.clientLocation.queryTime')
    expect(localStorageMgr.removeItem)
      .toHaveBeenCalledWith('tab.referralData.referringUser')
    expect(localStorageMgr.removeItem)
      .toHaveBeenCalledWith('tab.referralData.referringChannel')
    expect(localStorageMgr.removeItem)
      .toHaveBeenCalledWith('tab.consentData.newConsentDataExists')
    expect(localStorageMgr.removeItem)
      .toHaveBeenCalledWith('tab.newUser.hasCompletedTour')
    expect(localStorageMgr.removeItem)
      .toHaveBeenCalledWith('tab.newUser.extensionInstallId')
    expect(localStorageMgr.removeItem)
      .toHaveBeenCalledWith('tab.newUser.approxInstallTime')
    expect(localStorageMgr.removeItem)
      .toHaveBeenCalledWith('tab.experiments.anonUser')
    expect(localStorageMgr.removeItem).toHaveBeenCalledTimes(13)
  })

  test('sendVerificationEmail works as expected', async () => {
    expect.assertions(3)
    const mockSendEmailVerification = jest.fn(() => Promise.resolve())

    // A user must exist to be able to send a verification email.
    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true,
      getIdToken: jest.fn(() => 'fake-token-123'),
      sendEmailVerification: mockSendEmailVerification
    })

    const sendVerificationEmail = require('js/authentication/user').sendVerificationEmail
    const response = await sendVerificationEmail()
    expect(mockSendEmailVerification).toHaveBeenCalledWith({
      // Make sure post-verification page redirect is correct.
      url: absoluteUrl(enterUsernameURL)
    })
    expect(mockSendEmailVerification).toHaveBeenCalledTimes(1)
    expect(response).toBe(true)
  })

  test('sendVerificationEmail fails if no user exists', async () => {
    expect.assertions(2)
    const mockSendEmailVerification = jest.fn(() => Promise.resolve())

    // Suppress expected error message.
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser(null)

    const sendVerificationEmail = require('js/authentication/user').sendVerificationEmail
    const response = await sendVerificationEmail()
    expect(mockSendEmailVerification).not.toHaveBeenCalled()
    expect(response).toBe(false)
  })

  test('sendVerificationEmail fails gracefully if Firebase throws an error when sending an email', async () => {
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
      sendEmailVerification: mockSendEmailVerification
    })

    const sendVerificationEmail = require('js/authentication/user').sendVerificationEmail
    const response = await sendVerificationEmail()
    expect(response).toBe(false)
  })

  test('signInAnonymously works as expected', async () => {
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
      getIdToken: jest.fn(() => 'fake-token-123')
    })
    const signInAnonymously = require('js/authentication/user').signInAnonymously
    const response = await signInAnonymously()
    expect(response).toMatchObject({
      id: 'xyz987',
      email: null,
      isAnonymous: true,
      emailVerified: false,
      username: 'SomeUsername'
    })
  })

  test('reloadUser works as expected when the user exists', async () => {
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
      reload: mockReload
    })

    const reloadUser = require('js/authentication/user').reloadUser
    await reloadUser()
    expect(mockReload).toHaveBeenCalledTimes(1)
  })

  test('reloadUser does not error when the user does not exist', async () => {
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
