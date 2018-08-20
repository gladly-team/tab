
import localStorageMgr from 'utils/localstorage-mgr'
import {
  isAnonymousUserSignInEnabled
} from 'utils/feature-flags'
import {
  STORAGE_EXPERIMENT_ANON_USER
} from '../constants'

// Anonymous user sign-in test
export const ANON_USER_GROUP_NO_GROUP = 'none'
export const ANON_USER_GROUP_AUTH_REQUIRED = 'auth'
export const ANON_USER_GROUP_UNAUTHED_ALLOWED = 'unauthed'

/**
 * Assigns the user to a test group for the anonymous user
 * authentication test and stores the test group in localStorage.
 * @returns {undefined}
 */
const assignAnonymousUserTestGroup = () => {
  const isAnonUserEnabled = isAnonymousUserSignInEnabled()
  const groups = [
    ANON_USER_GROUP_AUTH_REQUIRED,
    ANON_USER_GROUP_UNAUTHED_ALLOWED
  ]
  var testGroup = isAnonUserEnabled
    // Equal chance of control vs. experimental group
    ? (
      groups[Math.floor(Math.random() * groups.length)]
    )
    // No group if anonymous user testing isn't enabled
    : ANON_USER_GROUP_NO_GROUP

  // Store the group in localStorage.
  localStorageMgr.setItem(STORAGE_EXPERIMENT_ANON_USER, testGroup)
}

/**
 * Assigns the user to test groups for all active tests.
 * @returns {undefined}
 */
export const assignUserToTestGroups = () => {
  assignAnonymousUserTestGroup()
}
