import moment from 'moment'
import {
  replaceUrl,
  authMessageURL,
  enterUsernameURL,
  loginURL,
  missingEmailMessageURL,
  verifyEmailURL
} from 'js/navigation/navigation'
import {
  getReferralData,
  isInIframe
} from 'js/utils/utils'
import {
  getUserToken,
  getCurrentUser,
  setUsernameInLocalStorage,
  signInAnonymously,
  reloadUser
} from 'authentication/user'
import environment from '../../relay-env'
import CreateNewUserMutation from 'js/mutations/CreateNewUserMutation'
import LogEmailVerifiedMutation from 'js/mutations/LogEmailVerifiedMutation'
import {
  ANON_USER_GROUP_UNAUTHED_ALLOWED,
  getAnonymousUserTestGroup,
  getUserTestGroupsForMutation
} from 'utils/experiments'
import {
  isAnonymousUserSignInEnabled
} from 'utils/feature-flags'
import {
  getBrowserExtensionInstallId,
  getBrowserExtensionInstallTime
} from 'utils/local-user-data-mgr'
import logger from 'utils/logger'

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
  return (
    // @experiment-anon-sign-in
    getAnonymousUserTestGroup() === ANON_USER_GROUP_UNAUTHED_ALLOWED &&
    !inAnonymousUserGracePeriod()
  )
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
  return !!installTime && moment().diff(installTime, 'days') < 2
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
  // feature is enabled, they're in the anonymous user test group,
  // and they joined recently.
  return (
    isAnonymousUserSignInEnabled() &&
    // @experiment-anon-sign-in
    getAnonymousUserTestGroup() === ANON_USER_GROUP_UNAUTHED_ALLOWED &&
    userRecentlyJoined
  )
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
    // To reduce noise in user creation stats, only create an anonymous
    // user if the user recently installed the browser extension.]
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

      // Determine if anonymous authentication is sufficient.
      if (allowAnonymousUser()) {
        // If the user is allowed to be anonymous, do not redirect.
        redirected = false
      } else {
        goToMainLoginPage()
        redirected = true
      }
    // If not creating an anonymous user, go to the login page.
    } else {
      goToMainLoginPage()
      redirected = true
    }
  // If the user has an anonymous account and is allowed to be
  // anonymous, do nothing. If they're anonymous but are not
  // allowed to be anonymous, go to the login page.
  } else if (user.isAnonymous) {
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
  } else if (!user.email) {
    replaceUrl(missingEmailMessageURL)
    redirected = true
  // User is logged in but their email is not verified.
  } else if (!user.emailVerified) {
    replaceUrl(verifyEmailURL)
    redirected = true
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
  // Get the currently-authenticated user.
  return getCurrentUser()
    .then(user => {
      // If there's no authenticated user, we can't create a new user.
      if (!user || !user.id) {
        throw new Error('Cannot create a new user. User is not authenticated.')
      }

      // Force-refetch the user ID token so it will have the
      // correct latest value for email verification.
      return getUserToken(true)
        .then(() => {
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
          logger.error(e)
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
    const maxTimesToPoll = 15
    const msWaitBetweenPolling = 250
    function seeIfEmailVerified () {
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
