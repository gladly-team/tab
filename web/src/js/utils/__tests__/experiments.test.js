/* eslint-env jest */

import localStorageMgr, {
  __mockClear
} from '../localstorage-mgr'
import {
  isAnonymousUserSignInEnabled
} from 'utils/feature-flags'

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
})
