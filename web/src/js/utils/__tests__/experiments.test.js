/* eslint-env jest */

import localStorageMgr, {
  __mockClear
} from '../localstorage-mgr'
import {
  isAnonymousUserSignInEnabled
} from 'utils/feature-flags'
import {
  STORAGE_EXPERIMENT_ANON_USER
} from '../../constants'

jest.mock('../localstorage-mgr')
jest.mock('utils/feature-flags')
afterEach(() => {
  __mockClear()
  jest.clearAllMocks()
})

describe('experiments', () => {
  test('assignUserToTestGroups saves the user\'s test groups to localStorage', () => {
    // Control for randomness.
    jest.spyOn(Math, 'random').mockReturnValue(0)

    // Make sure any experiment-related features are enabled.
    isAnonymousUserSignInEnabled.mockReturnValue(true)

    const assignUserToTestGroups = require('../experiments').assignUserToTestGroups
    assignUserToTestGroups()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith('tab.experiments.anonUser', 'auth')
  })

  test('assignUserToTestGroups saves a "none" test group value for the anonUser test when the feature is not enabled', () => {
    // Anonymous user sign-in is not enabled.
    isAnonymousUserSignInEnabled.mockReturnValue(false)

    const assignUserToTestGroups = require('../experiments').assignUserToTestGroups
    assignUserToTestGroups()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith('tab.experiments.anonUser', 'none')
  })

  test('getAnonymousUserTestGroup returns the saved test group', () => {
    // Anonymous user sign-in is enabled.
    isAnonymousUserSignInEnabled.mockReturnValue(true)

    // Set the test group in storage.
    localStorageMgr.setItem(STORAGE_EXPERIMENT_ANON_USER, 'unauthed')

    const getAnonymousUserTestGroup = require('../experiments').getAnonymousUserTestGroup
    const testGroup = getAnonymousUserTestGroup()
    expect(testGroup).toBe('unauthed')
  })

  test('getAnonymousUserTestGroup returns "none" if there is no saved test group', () => {
    // Anonymous user sign-in is enabled.
    isAnonymousUserSignInEnabled.mockReturnValue(true)

    // Set the test group in storage.
    localStorageMgr.removeItem(STORAGE_EXPERIMENT_ANON_USER)

    const getAnonymousUserTestGroup = require('../experiments').getAnonymousUserTestGroup
    const testGroup = getAnonymousUserTestGroup()
    expect(testGroup).toBe('none')
  })

  test('getAnonymousUserTestGroup returns "none" if the saved test group value is not a valid test group', () => {
    // Anonymous user sign-in is enabled.
    isAnonymousUserSignInEnabled.mockReturnValue(true)

    // Set an invalid test group in storage.
    localStorageMgr.setItem(STORAGE_EXPERIMENT_ANON_USER, 'blah')

    const getAnonymousUserTestGroup = require('../experiments').getAnonymousUserTestGroup
    const testGroup = getAnonymousUserTestGroup()
    expect(testGroup).toBe('none')
  })
})
