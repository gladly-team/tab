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
  isInIframe
} from 'web-utils'
import {
  setUsernameInLocalStorage
} from 'authentication/user'

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

  // If the user is not fully logged in, redirect to the
  // appropriate auth page.
  // User is not logged in.
  if (!user || !user.id) {
    // If the page is in an iframe (e.g. the user opened it via an iframed
    // new tab), authentication may not work correctly. Show an intermediary
    // page that will open a non-iframed auth page.
    if (isInIframe()) {
      goTo(authMessageURL)
    } else {
      goToLogin()
    }
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
