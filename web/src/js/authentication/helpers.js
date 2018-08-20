import moment from 'moment'
import {
  goTo,
  goToLogin,
  replaceUrl,
  authMessageURL,
  enterUsernameURL,
  missingEmailMessageURL,
  verifyEmailURL
} from 'navigation/navigation'
import {
  getReferralData,
  isInIframe
} from 'web-utils'
import {
  getCurrentUser,
  setUsernameInLocalStorage
} from 'authentication/user'
import environment from '../../relay-env'
import CreateNewUserMutation from 'mutations/CreateNewUserMutation'
import {
  ANON_USER_GROUP_UNAUTHED_ALLOWED,
  getAnonymousUserTestGroup
} from 'utils/experiments'
import {
  isAnonymousUserSignInEnabled
} from 'utils/feature-flags'
import {
  getBrowserExtensionInstallTime
} from 'utils/local-user-data-mgr'

/**
 * Return whether the current user is allowed to have an anonymous
 * account.
 * @return {boolean} Whether the current user is allowed to have an
 *   anonymous account.
 */
const allowAnonymousUser = () => {
  const installTime = getBrowserExtensionInstallTime()
  var userRecentlyJoined
  if (installTime) {
    userRecentlyJoined = moment().diff(installTime, 'days') < 2
  } else {
    userRecentlyJoined = false
  }

  // The user can have an anonymous account if the anonymous user
  // feature is enabled, they're in the anonymous user test group,
  // and they joined recently.
  return (
    isAnonymousUserSignInEnabled() &&
    getAnonymousUserTestGroup() === ANON_USER_GROUP_UNAUTHED_ALLOWED &&
    userRecentlyJoined
  )
}

/**
 * Based on the user object state, determine if we need to redirect
 * to an authentication page. If the user is not fully authenticated,
 * redirect and return true. If the user is fully authenticated, do
 * not redirect and return false.
 * @param {object} user - The user object for the app.
 * @param {string} user.id - The user's ID
 * @param {string} user.email - The user's email
 * @param {string} user.username - The user's username
 * @param {boolean} user.isAnonymous - Whether the user is anonymous
 * @param {boolean} user.emailVerified - Whether the user has verified their email
 * @param {string} fetchedUsername - The user's username from the server, which
 *   may differ from the one in localStorage.
 * @return {boolean} Whether we redirected; i.e., whether the user was not fully
 *   authenticated.
 */
export const checkAuthStateAndRedirectIfNeeded = (user, fetchedUsername = null) => {
  var redirected = true

  // If the user is not fully logged in, redirect to the
  // appropriate auth page.
  // User is not logged in.
  if (!user || !user.id) {
    if (allowAnonymousUser()) {
      // TODO:
      // Authenticate the user anonymously.
      // Create a user in our database.
      // TODO: add tests for this anonymous user logic.
    } else {
      // If the page is in an iframe (e.g. the user opened it via an iframed
      // new tab), authentication may not work correctly. Show an intermediary
      // page that will open a non-iframed auth page.
      if (isInIframe()) {
        goTo(authMessageURL)
      } else {
        goToLogin()
      }
    }
  // If the user has an anonymous account and is allowed to be
  // anonymous, do nothing.
  } else if (user.isAnonymous && allowAnonymousUser()) {
    // TODO: add tests for this case
    redirected = false
  // If the user does not have an email address, show a message
  // asking them to sign in with a different method.
  } else if (!user.email) {
    replaceUrl(missingEmailMessageURL)
  // User is logged in but their email is not verified.
  } else if (!user.emailVerified) {
    replaceUrl(verifyEmailURL)
  // User is logged in but has not set a username.
  } else if (!user.username) {
    // If the username isn't in localStorage, check if it
    // exists on the user from the database.
    // We use the user fetched from the database because
    // the username property isn't present on our auth token
    // user identity.
    if (fetchedUsername) {
      // The username exists; set it in localStorage and do not redirect
      // to an auth page.
      setUsernameInLocalStorage(fetchedUsername)
      redirected = false
    } else {
      replaceUrl(enterUsernameURL)
    }
  } else {
    redirected = false
  }
  return redirected
}

/**
 * Create a new user in our database, or get the user if they already
 * exist. This is idempotent and may be called when returning users sign in.
 * @returns {Promise<object>} user - A promise that resolves into a
 *   user object
 * @returns {string} user.id - The user's ID, the same value as the
 *   userId argument
 * @returns {string|null} user.email - The user's email, the same value as the
 *   email argument
 * @returns {string|null} user.username - The user's username, if already
 *   set; or null, if not yet set
 */
export const createNewUser = () => {
  // Get the currently-authenticated user.
  return getCurrentUser()
    .then(user => {
      // If there's no authenticated user, we can't create a new user.
      if (!user || !user.id) {
        throw new Error('Cannot create a new user. User is not authenticated.')
      }

      // Get any referral data that exists.
      const referralData = getReferralData()

      return new Promise((resolve, reject) => {
        CreateNewUserMutation(
          environment,
          user.id,
          user.email,
          referralData,
          (response) => {
            resolve(response.createNewUser)
          },
          (err) => {
            console.error('Error at createNewUser:', err)
            reject(new Error('Could not create new user', err))
          }
        )
      })
    })
    .catch(e => {
      console.log(e)
      throw e
    })
}
