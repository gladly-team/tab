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

/**
 * Return whether the current user is allowed to have an anonymous
 * account.
 * @return {boolean} Whether the current user is allowed to have an
 *   anonymous account.
 */
const allowAnonymousUser = () => {
  // TODO: determine by the status of feature flag / split-testing
  return false
}

/**
 * Based on the user object state, determine if we need to redirect
 * to an authentication page. If the user is not fully authenticated,
 * redirect and return true. If teh user is fully authenticated, do
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

  // FIXME: need to handle a state where the user is authenticated
  // but does not have a user on the server. This can happen if
  // Firebase authentication succeeds but the request to our server
  // fails (e.g., network error, or user navigates away).
  // We may want to handle this in QueryRenderers:
  // - In GraphQL, create a custom UserDoesNotExist error
  // - UserModel extends BaseModel's `get` method; if the item
  //   does not exist, throw UserDoesNotExist
  // - In formatError, return error codes. Also filter out some
  //   errors that we do not want to log because they're sometimes
  //   expected, like UserDoesNotExist errors.
  // - In QueryRenderers, if the error indicates that the user does
  //   not exist, create the user and then re-query.

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
 * @returns {Promise<object>} user - A promise that resolves into an
 *   object with a few requested fields
 * @returns {string} user.id - The user's ID, the same value as the
 *   userId argument
 * @returns {string} user.email - The user's email, the same value as the
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
