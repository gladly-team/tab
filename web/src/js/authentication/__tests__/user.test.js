/* eslint-env jest */

import localStorageMgr from 'utils/localstorage-mgr'
import {
  STORAGE_KEY_USERNAME
} from '../../constants'

jest.mock('utils/localstorage-mgr')

afterEach(() => {
  jest.clearAllMocks()
  localStorageMgr.clear()
})

describe('authentication user module tests', () => {
  test('getUsername fetches the username from localStorage', () => {
    localStorageMgr.setItem(STORAGE_KEY_USERNAME, 'BobMIII')
    const getUsername = require('../user').getUsername
    expect(getUsername()).toBe('BobMIII')
  })

  test('setUsernameInLocalStorage works as expected', () => {
    const setUsernameInLocalStorage = require('../user').setUsernameInLocalStorage
    setUsernameInLocalStorage('MichaelC')
    expect(localStorageMgr.getItem(STORAGE_KEY_USERNAME)).toBe('MichaelC')
  })

  test('formatUser works as expected', () => {
    // formatUser gets the username from localStroage.
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
})
