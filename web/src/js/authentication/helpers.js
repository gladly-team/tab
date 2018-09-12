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
  getUserToken,
  getCurrentUser,
  setUsernameInLocalStorage,
  signInAnonymously,
  reloadUser
} from 'authentication/user'
import environment from '../../relay-env'
import CreateNewUserMutation from 'mutations/CreateNewUserMutation'
import LogEmailVerifiedMutation from 'mutations/LogEmailVerifiedMutation'
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
import logger from 'utils/logger'

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
 * Redirect to the main login page if not in an iframe, or redirect
 * to an intermediary page if in an iframe.
 * @return {undefined}
 */
const goToMainLoginPage = () => {
  // The user is not allowed to be anonymous, so show the login screen.
  // If the page is in an iframe (e.g. the user opened it via an iframed
  // new tab), authentication may not work correctly. Show an intermediary
  // page that will open a non-iframed auth page.
  if (isInIframe()) {
    goTo(authMessageURL)
  } else {
    goToLogin()
  }
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
 * @return {Promise<boolean>} A Promise resolving into a Boolean, which
 *   represents whether or not we redirected (e.g. true if the user was not fully
 *   authenticated).
 */
export const checkAuthStateAndRedirectIfNeeded = async (user, fetchedUsername = null) => {
  var redirected = true

  // If the user is not fully logged in, redirect to the
  // appropriate auth page.
  // User is not logged in.
  if (!user || !user.id) {
    // Authenticate the user anonymously.
    try {
      await signInAnonymously()
    } catch (e) {
      throw e
    }

    // Create a user in our database.
    try {
      await createNewUser()
    } catch (e) {
      throw e
    }

    // Determine if anonymous authentication is sufficient.
    if (allowAnonymousUser()) {
      // If the user is allowed to be anonymous, do not redirect.
      redirected = false
    } else {
      goToMainLoginPage()
    }
  // If the user has an anonymous account and is allowed to be
  // anonymous, do nothing. If they're anonymous but are not
  // allowed to be anonymous, go to the login page.
  } else if (user.isAnonymous) {
    if (allowAnonymousUser()) {
      redirected = false
    } else {
      goToMainLoginPage()
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

      // TODO:
      // Pass the user's experimentGroups { anonUser } value

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
      console.error(e)
      throw e
    })
}

/**
 * Poll the user to see if they verified their email address so that
 * we can log it is verified. It would be better to user a cloud
 * function for this, or at least an official callback from the
 * Firebase SDK, but Firebase does not yet support one. See:
 * https://stackoverflow.com/q/43503377
 * @returns {Promise<Boolean>} Whether the user's email is verified.
 */
export const checkIfEmailVerified = () => {
  return new Promise((resolve, reject) => {
    var polledTimes = 0
    const maxTimesToPoll = 10
    const msWaitBetweenPolling = 50
    function seeIfEmailVerified () {
      if (polledTimes > maxTimesToPoll) {
        return resolve(false)
      }
      getCurrentUser()
        .then(user => {
          // The email is verified. Log the verification, stop polling,
          // and return true.
          if (user.emailVerified) {
            // Force-refetch the user ID token so it will have the
            // correct latest value for email verification.
            getUserToken(true)
              .then(() => {
                LogEmailVerifiedMutation(environment, user.id, () => {},
                  // onError
                  err => {
                    logger.error(err)
                  }
                )
                resolve(true)
              })
              .catch(e => {
                logger.error(e)
                reject(e)
              })

          // The email is not yet verified. Wait some time, then try
          // to poll Firebase again to see if it's changed.
          } else {
            polledTimes += 1

            // Reload the user and check again.
            reloadUser()
              .then(() => {
                setTimeout(() => {
                  seeIfEmailVerified()
                }, msWaitBetweenPolling)
              })
              .catch(e => {
                logger.error(e)
                reject(e)
              })
          }
        })
        .catch(e => {
          logger.error(e)
          reject(e)
        })
    }
    seeIfEmailVerified()
  })
}
