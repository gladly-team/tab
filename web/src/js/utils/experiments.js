
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

// @experiment-anon-sign-in
/**
 * Return the test group for the anonymous user authentication
 * test from localStorage. If no test group is set, return the
 * 'none' test group.
 * @returns {String} One of the valid test group names.
 */
export const getAnonymousUserTestGroup = () => {
  const item = localStorageMgr.getItem(STORAGE_EXPERIMENT_ANON_USER)
  var testGroup = ANON_USER_GROUP_NO_GROUP
  if (item === ANON_USER_GROUP_AUTH_REQUIRED ||
    item === ANON_USER_GROUP_UNAUTHED_ALLOWED
  ) {
    testGroup = item
  }
  return testGroup
}

// @experiment-anon-sign-in
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

// @experiment-anon-sign-in
/**
 * Converts the anonymous test group value to its corresponding
 * string used by the server-side, compliant with our GraphQL
 * schema.
 * @param {String} testGroup - One of the constants representing
 *   the user's test group for the anonymous user test.
 * @returns {String} The string representing the test group,
 *   compliant with our GraphQL schema.
 */
const anonymousTestGroupToSchemaValue = testGroup => {
  // Corresponds to server-side enum.
  const map = {
    [ANON_USER_GROUP_NO_GROUP]: 'NONE',
    [ANON_USER_GROUP_AUTH_REQUIRED]: 'AUTHED_USER_ONLY',
    [ANON_USER_GROUP_UNAUTHED_ALLOWED]: 'ANONYMOUS_ALLOWED'
  }
  return map[testGroup]
}

/**
 * Returns an object with a key for each active experiment. Each
 * key's value is an integer representing the test group to which
 * the user is assigned for that test. The object takes the shape
 * of our GraphQL schema's ExperimentGroupsType.
 * @returns {Object} The object of experiment group assignments
 *   for the user, taking the shape of our GraphQL schema's
 *   ExperimentGroupsType.
 */
export const getUserTestGroupsForMutation = () => {
  return {
    anonSignIn: anonymousTestGroupToSchemaValue(getAnonymousUserTestGroup())
  }
}
