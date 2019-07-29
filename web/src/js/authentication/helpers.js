import moment from 'moment'
import {
  replaceUrl,
  authMessageURL,
  enterUsernameURL,
  loginURL,
  missingEmailMessageURL,
  verifyEmailURL,
} from 'js/navigation/navigation'
import { getReferralData, isInIframe } from 'js/utils/utils'
import {
  getUserToken,
  getCurrentUser,
  setUsernameInLocalStorage,
  signInAnonymously,
  reloadUser,
} from 'js/authentication/user'
import environment from 'js/relay-env'
import CreateNewUserMutation from 'js/mutations/CreateNewUserMutation'
import LogEmailVerifiedMutation from 'js/mutations/LogEmailVerifiedMutation'
import { getUserTestGroupsForMutation } from 'js/utils/experiments'
import { isAnonymousUserSignInEnabled } from 'js/utils/feature-flags'
import {
  getBrowserExtensionInstallId,
  getBrowserExtensionInstallTime,
} from 'js/utils/local-user-data-mgr'
import logger from 'js/utils/logger'

/**
 * Return whether the current user is an anonymous user who was
 * previously able to see the dashboard but is now required to
 * sign in. This will return false if the user was authenticated
 * but has signed out.
 * @return {Boolean} Whether the current user is a previously-
 *   anonymous user who must now sign in
 */
export const anonymousUserMandatorySignIn = () => {
  // If the user was authed but logged out, we remove the
  // extension install time from localStorage and this will
  // return false.
  return !inAnonymousUserGracePeriod()
}

/**
 * Return whether the current user has joined recently enough
 * that, if they're an anonymous user, they are not yet required
 * to sign in. In other words, whether the user joined recently.
 * @return {Boolean} Whether the current user is still within
 *   the grace period where anonymous users do not need to sign
 *   in
 */
const inAnonymousUserGracePeriod = () => {
  const installTime = getBrowserExtensionInstallTime()
  return !!installTime && moment().diff(installTime, 'days') < 4
}

/**
 * Return whether the current user is allowed to have an anonymous
 * account.
 * @return {Boolean} Whether the current user is allowed to have an
 *   anonymous account.
 */
const allowAnonymousUser = () => {
  const userRecentlyJoined = inAnonymousUserGracePeriod()

  // The user can have an anonymous account if the anonymous user
  // feature is enabled and they joined recently.
  return isAnonymousUserSignInEnabled() && userRecentlyJoined
}

/**
 * Return whether we should create an anonymous account for this
 * user: true only if the user installed the browser extension
 * very recently.
 * This is an attempt to reduce the noise of unnecessary user
 * creations, which are likely caused by users whose browsers do
 * not persist the user between tabs/sessions (e.g. incognito
 * browsing).
 * @return {Boolean} Whether we should create an anonymous account
 *   for this user.
 */
const shouldCreateAnonymousUser = () => {
  const installTime = getBrowserExtensionInstallTime()
  const secondsAfterInstallToAllowCreation = 30
  return (
    installTime &&
    moment().diff(installTime, 'seconds') < secondsAfterInstallToAllowCreation
  )
}

/**
 * Redirect to the main login page if not in an iframe, or redirect
 * to an intermediary page if in an iframe.
 * @return {undefined}
 */
const goToMainLoginPage = (urlParamsObj = {}) => {
  // The user is not allowed to be anonymous, so show the login screen.
  // If the page is in an iframe (e.g. the user opened it via an iframed
  // new tab), authentication may not work correctly. Show an intermediary
  // page that will open a non-iframed auth page.
  if (isInIframe()) {
    replaceUrl(authMessageURL, urlParamsObj)
  } else {
    replaceUrl(loginURL, urlParamsObj)
  }
}

/**
 * Create an anonymous user in our authentication system and on our
 * server side, if possible.
 * @return {Object|null} The new user object (AuthUser), or null
 *   if we could not create a user.
 */
export const createAnonymousUserIfPossible = async () => {
  // To reduce noise in user creation stats, only create an anonymous
  // user if the user recently installed the browser extension.
  if (shouldCreateAnonymousUser()) {
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
    return await getCurrentUser()
  } else {
    return null
  }
}

// TODO: preserve query parameters when redirecting to other auth pages
/**
 * Based on the AuthUser object state, determine if we need to redirect
 * to an authentication page. If the user is not fully authenticated,
 * redirect and return true. If the user is fully authenticated, do
 * not redirect and return false.
 * @param {object} authUser - The AuthUser object
 * @param {string} authUser.id - The user's ID
 * @param {string} authUser.email - The user's email
 * @param {string} authUser.username - The user's username from local storage
 * @param {boolean} authUser.isAnonymous - Whether the user is anonymous
 * @param {boolean} authUser.emailVerified - Whether the user has verified their email
 * @param {object} user - The user object from our API
 * @param {object} user.username - The user's username from our database. This
 *   may exist when authUser.username does not; for example, if a user clears
 *   their local storage.
 * @return {Boolean} Whether or not we redirected (e.g. true if the
 *   user was not fully authenticated).
 */
export const redirectToAuthIfNeeded = (authUser, user = null) => {
  var redirected = true

  // User does not exist. Require login.
  if (!authUser || !authUser.id) {
    goToMainLoginPage()
    redirected = true
    // If the user has an anonymous account and is allowed to be
    // anonymous, do nothing. If they're anonymous but are not
    // allowed to be anonymous, go to the login page.
  } else if (authUser.isAnonymous) {
    if (allowAnonymousUser()) {
      redirected = false
    } else {
      // This is an anonymous user who was using the app but is now
      // required to sign in.
      if (anonymousUserMandatorySignIn()) {
        // Include the "mandatory" URL parameter so we're able to
        // show an explanation on the sign-in views.
        goToMainLoginPage({ mandatory: 'true' })
        redirected = true
      } else {
        goToMainLoginPage()
        redirected = true
      }
    }
    // If the user does not have an email address, show a message
    // asking them to sign in with a different method.
  } else if (!authUser.email) {
    replaceUrl(missingEmailMessageURL)
    redirected = true
    // User is logged in but their email is not verified.
  } else if (!authUser.emailVerified) {
    replaceUrl(verifyEmailURL)
    redirected = true
    // User is logged in but has not set a username.
  } else if (!authUser.username) {
    // If the username exists but is not in local storage, set the
    // username. The username from AuthUser relies on local storage.
    if (user && user.username) {
      setUsernameInLocalStorage(user.username)
      redirected = false
    } else {
      replaceUrl(enterUsernameURL)
      redirected = true
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
  // Force-refetch the user ID token so it will have the
  // correct latest value for email verification.
  return getUserToken(true)
    .then(() => {
      // Get the currently-authenticated user.
      return getCurrentUser()
        .then(user => {
          // If there's no authenticated user, we can't create a new user.
          if (!user || !user.id) {
            throw new Error(
              'Cannot create a new user. User is not authenticated.'
            )
          }

          // Get additional data we want to log with creation.
          const referralData = getReferralData()
          const experimentGroups = getUserTestGroupsForMutation()
          const installId = getBrowserExtensionInstallId()
          const installTime = getBrowserExtensionInstallTime()

          return new Promise((resolve, reject) => {
            CreateNewUserMutation(
              environment,
              user.id,
              user.email,
              referralData,
              experimentGroups,
              installId,
              installTime,
              response => {
                resolve(response.createNewUser)
              },
              err => {
                console.error('Could not create new user:')
                reject(err)
              }
            )
          })
        })
        .catch(e => {
          logger.error(e)
        })
    })
    .catch(e => {
      logger.error(e)
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
    const maxTimesToPoll = 15
    const msWaitBetweenPolling = 250
    function seeIfEmailVerified() {
      if (polledTimes > maxTimesToPoll) {
        return resolve(false)
      }
      getCurrentUser()
        .then(user => {
          // The email is verified. Log the verification, stop polling,
          // and return true.
          if (user && user.emailVerified) {
            // Force-refetch the user ID token so it will have the
            // correct latest value for email verification.
            getUserToken(true)
              .then(() => {
                LogEmailVerifiedMutation(
                  environment,
                  user.id,
                  () => {},
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
