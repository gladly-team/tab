/* eslint-env jest */

import {
  STORAGE_KEY_USERNAME
} from '../../constants'
jest.mock('utils/localstorage-mgr')

const storedMockDevAuthenticationEnvVar = process.env.MOCK_DEV_AUTHENTICATION
const storedNodeEnvVar = process.env.NODE_ENV

afterEach(() => {
  jest.clearAllMocks()

  const localStorageMgr = require('utils/localstorage-mgr').default
  localStorageMgr.clear()

  // Reset env vars and modules
  process.env.MOCK_DEV_AUTHENTICATION = storedMockDevAuthenticationEnvVar
  process.env.NODE_ENV = storedNodeEnvVar
  jest.resetModules()
})

describe('authentication user module tests', () => {
  test('getUsername fetches the username from localStorage', () => {
    const localStorageMgr = require('utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'BobMIII')
    const getUsername = require('../user').getUsername
    expect(getUsername()).toBe('BobMIII')
  })

  test('setUsernameInLocalStorage works as expected', () => {
    const setUsernameInLocalStorage = require('../user').setUsernameInLocalStorage
    setUsernameInLocalStorage('MichaelC')
    const localStorageMgr = require('utils/localstorage-mgr').default
    expect(localStorageMgr.getItem(STORAGE_KEY_USERNAME)).toBe('MichaelC')
  })

  test('formatUser works as expected', () => {
    // formatUser gets the username from localStorage.
    const localStorageMgr = require('utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'PaulM')

    const formatUser = require('../user').formatUser
    const firebaseUser = {
      uid: 'abc123',
      email: 'ostrichcoat@example.com',
      isAnonymous: false,
      emailVerified: true
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
    const localStorageMgr = require('utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'RGates')

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser({
      uid: 'xyz987',
      email: 'foo@example.com',
      isAnonymous: false,
      emailVerified: true
    })

    const getCurrentUser = require('../user').getCurrentUser
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

    // formatUser gets the username from localStorage.
    const localStorageMgr = require('utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'RGates')

    const __setFirebaseUser = require('firebase/app').__setFirebaseUser
    __setFirebaseUser(null)

    const getCurrentUser = require('../user').getCurrentUser
    const currentUser = await getCurrentUser()
    expect(currentUser).toBeNull()
  })

  test('getCurrentUser returns a mock user when using mock authentication in development', async () => {
    expect.assertions(1)

    // formatUser gets the username from localStorage.
    const localStorageMgr = require('utils/localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'SomeUsername')

    // Set development env vars.
    process.env.MOCK_DEV_AUTHENTICATION = 'true'
    process.env.NODE_ENV = 'development'

    const getCurrentUser = require('../user').getCurrentUser
    const currentUser = await getCurrentUser()
    expect(currentUser).toEqual({
      id: 'abcdefghijklmno',
      email: 'kevin@example.com',
      username: 'SomeUsername',
      isAnonymous: false,
      emailVerified: true
    })
  })
})
