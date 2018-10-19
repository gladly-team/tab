/* eslint-env jest */

import localStorageMgr, {
  __mockClear
} from 'js/utils/localstorage-mgr'
import {
  isAnonymousUserSignInEnabled
} from 'js/utils/feature-flags'
import {
  STORAGE_EXPERIMENT_ANON_USER
} from 'js/constants'

jest.mock('js/utils/localstorage-mgr')
jest.mock('js/utils/feature-flags')
afterEach(() => {
  __mockClear()
  jest.clearAllMocks()
})

describe('experiments', () => {
  /* Tests for all experiments */

  test('assignUserToTestGroups saves the user\'s test groups to localStorage', () => {
    // Control for randomness.
    jest.spyOn(Math, 'random').mockReturnValue(0)

    // Make sure any experiment-related features are enabled.
    isAnonymousUserSignInEnabled.mockReturnValue(true)

    const assignUserToTestGroups = require('js/utils/experiments').assignUserToTestGroups
    assignUserToTestGroups()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith('tab.experiments.anonUser', 'auth')
  })

  /* Tests for the "anonymous user" test */

  test('assignUserToTestGroups saves a "none" test group value for the anonUser test when the feature is not enabled', () => {
    // Anonymous user sign-in is not enabled.
    isAnonymousUserSignInEnabled.mockReturnValue(false)

    const assignUserToTestGroups = require('js/utils/experiments').assignUserToTestGroups
    assignUserToTestGroups()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith('tab.experiments.anonUser', 'none')
  })

  test('getAnonymousUserTestGroup returns the saved test group', () => {
    // Anonymous user sign-in is enabled.
    isAnonymousUserSignInEnabled.mockReturnValue(true)

    // Set the test group in storage.
    localStorageMgr.setItem(STORAGE_EXPERIMENT_ANON_USER, 'unauthed')

    const getAnonymousUserTestGroup = require('js/utils/experiments').getAnonymousUserTestGroup
    const testGroup = getAnonymousUserTestGroup()
    expect(testGroup).toBe('unauthed')
  })

  test('getAnonymousUserTestGroup returns "none" if there is no saved test group', () => {
    // Anonymous user sign-in is enabled.
    isAnonymousUserSignInEnabled.mockReturnValue(true)

    // Set the test group in storage.
    localStorageMgr.removeItem(STORAGE_EXPERIMENT_ANON_USER)

    const getAnonymousUserTestGroup = require('js/utils/experiments').getAnonymousUserTestGroup
    const testGroup = getAnonymousUserTestGroup()
    expect(testGroup).toBe('none')
  })

  test('getAnonymousUserTestGroup returns "none" if the saved test group value is not a valid test group', () => {
    // Anonymous user sign-in is enabled.
    isAnonymousUserSignInEnabled.mockReturnValue(true)

    // Set an invalid test group in storage.
    localStorageMgr.setItem(STORAGE_EXPERIMENT_ANON_USER, 'blah')

    const getAnonymousUserTestGroup = require('js/utils/experiments').getAnonymousUserTestGroup
    const testGroup = getAnonymousUserTestGroup()
    expect(testGroup).toBe('none')
  })

  test('getUserTestGroupsForMutation returns the expected value for an assigned group', () => {
    isAnonymousUserSignInEnabled.mockReturnValue(true)
    localStorageMgr.setItem(STORAGE_EXPERIMENT_ANON_USER, 'unauthed')
    const getUserTestGroupsForMutation = require('js/utils/experiments').getUserTestGroupsForMutation
    expect(getUserTestGroupsForMutation()).toMatchObject({
      anonSignIn: 'ANONYMOUS_ALLOWED'
    })
  })

  test('getUserTestGroupsForMutation returns the expected value when the user is not assigned to a group', () => {
    isAnonymousUserSignInEnabled.mockReturnValue(true)
    localStorageMgr.removeItem(STORAGE_EXPERIMENT_ANON_USER)
    const getUserTestGroupsForMutation = require('js/utils/experiments').getUserTestGroupsForMutation
    expect(getUserTestGroupsForMutation()).toMatchObject({
      anonSignIn: 'NONE'
    })
  })
})
