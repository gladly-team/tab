import firebase from 'firebase/app'
import 'firebase/auth'
import localStorageMgr from 'js/utils/localstorage-mgr'
import {
  STORAGE_KEY_USERNAME,
  STORAGE_TABS_LAST_TAB_OPENED_DATE,
  STORAGE_TABS_RECENT_DAY_COUNT,
  STORAGE_LOCATION_COUNTRY_ISO_CODE,
  STORAGE_LOCATION_IS_IN_EU,
  STORAGE_LOCATION_QUERY_TIME,
  STORAGE_REFERRAL_DATA_REFERRING_USER,
  STORAGE_REFERRAL_DATA_REFERRING_CHANNEL,
  STORAGE_NEW_CONSENT_DATA_EXISTS,
  STORAGE_NEW_USER_HAS_COMPLETED_TOUR,
  STORAGE_EXTENSION_INSTALL_ID,
  STORAGE_APPROX_EXTENSION_INSTALL_TIME,
  STORAGE_EXPERIMENT_ANON_USER,
} from 'js/constants'
import { absoluteUrl, enterUsernameURL } from 'js/navigation/navigation'
import logger from 'js/utils/logger'

// Only for development.
const shouldMockAuthentication =
  process.env.REACT_APP_MOCK_DEV_AUTHENTICATION === 'true' &&
  process.env.NODE_ENV === 'development'

/**
 * Get the username. This uses localStorage, not our user database,
 * so that we can rely on it during the sign up process.
 * @returns {string} The user's username
 */
export const getUsername = () => {
  return localStorageMgr.getItem(STORAGE_KEY_USERNAME)
}

/**
 * Set the username in localStorage.
 * @params {string} The user's username
 */
export const setUsernameInLocalStorage = username => {
  return localStorageMgr.setItem(STORAGE_KEY_USERNAME, username)
}

/**
 * Take the user object from our auth service and create
 * the object we'll use in the app.
 * @returns {Pbject} AuthUser - The user object for the app.
 * @returns {String} AuthUser.id - The user's ID
 * @returns {String} AuthUser.email - The user's email
 * @returns {String} AuthUser.username - The user's username
 * @returns {Boolean} AuthUser.isAnonymous - Whether the user is anonymous
 * @returns {Boolean} AuthUser.emailVerified - Whether the user has verified their email
 */
const formatUser = authUserObj => {
  return {
    id: authUserObj.uid,
    email: authUserObj.email,
    username: getUsername(),
    isAnonymous: authUserObj.isAnonymous,
    emailVerified: authUserObj.emailVerified,
  }
}

/**
 * Get a mock, pared-down Firebase user for offline development.
 * @return {Object}
 */
const getMockFirebaseUser = () => {
  const userId = 'abcdefghijklmno'
  const email = 'kevin@example.com'
  const tokenPayload = {
    sub: userId,
    email: 'kevin@example.com',
    email_verified: true,
  }
  const jwt = require('jsonwebtoken')
  const token = jwt.sign(tokenPayload, 'fakeSecret')
  return {
    uid: userId,
    email: email,
    isAnonymous: false,
    emailVerified: true,
    getIdToken: () => {
      return token
    },
  }
}

/**
 * Return the raw Firebase user instance.
 * @returns {user} a Firebase User
 */
const getCurrentFirebaseUser = async () => {
  // For development only: optionally mock the user
  // and user token.
  if (shouldMockAuthentication) {
    return new Promise((resolve, reject) => {
      resolve(getMockFirebaseUser())
    })
  }
  return new Promise((resolve, reject) => {
    try {
      // https://firebase.google.com/docs/auth/web/manage-users
      const unsubscribe = firebase.auth().onAuthStateChanged(authUser => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe()
        }
        if (authUser) {
          resolve(authUser)
        } else {
          resolve(null)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Get the current user object. Returns null if the user is not
 * logged in.
 * @returns {Promise<({AuthUser}|null)>}  A promise that resolves into either
 *   an AuthUser object or null.
 */
export const getCurrentUser = async () => {
  try {
    const authUser = await getCurrentFirebaseUser()
    if (authUser) {
      return formatUser(authUser)
    } else {
      return null
    }
  } catch (e) {
    throw e
  }
}

/**
 * A function to register a listener for when the user's authentication
 * state changes between signed in and not signed in.
 * @return {AuthUser|null} An object representing the authenticated
 *   user, or null if the user does not exist.
 */
export const onAuthStateChanged = callback => {
  // Return the listener unsubscribe function.
  // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged
  const unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
    let user = null
    if (shouldMockAuthentication) {
      // For development only. Return a mock user.
      user = formatUser(getMockFirebaseUser())
    } else if (firebaseUser) {
      user = formatUser(firebaseUser)
    } else {
      user = null
    }
    callback(user)
  })
  return unsubscribe
}

/**
 * Get the user's token.
 * @param {Boolean} forceRefresh - Whether to force Firebase to refresh
 *   the token regardless of expiration status.
 * @returns {(string|null)} The token, if the user is authenticated;
 *   otherwise, null.
 */
export const getUserToken = async forceRefresh => {
  try {
    const authUser = await getCurrentFirebaseUser()
    if (!authUser) {
      return null
    }
    const token = authUser.getIdToken(forceRefresh)
    if (token) {
      return token
    } else {
      return null
    }
  } catch (e) {
    throw e
  }
}

/**
 * Delete any sensitive localStorage items.
 * @returns {null}
 */
const clearAuthLocalStorageItems = () => {
  // Currently, removes everything except background settings.
  localStorageMgr.removeItem(STORAGE_KEY_USERNAME)
  localStorageMgr.removeItem(STORAGE_TABS_LAST_TAB_OPENED_DATE)
  localStorageMgr.removeItem(STORAGE_TABS_RECENT_DAY_COUNT)
  localStorageMgr.removeItem(STORAGE_LOCATION_COUNTRY_ISO_CODE)
  localStorageMgr.removeItem(STORAGE_LOCATION_IS_IN_EU)
  localStorageMgr.removeItem(STORAGE_LOCATION_QUERY_TIME)
  localStorageMgr.removeItem(STORAGE_REFERRAL_DATA_REFERRING_USER)
  localStorageMgr.removeItem(STORAGE_REFERRAL_DATA_REFERRING_CHANNEL)
  localStorageMgr.removeItem(STORAGE_NEW_CONSENT_DATA_EXISTS)
  localStorageMgr.removeItem(STORAGE_NEW_USER_HAS_COMPLETED_TOUR)
  localStorageMgr.removeItem(STORAGE_EXTENSION_INSTALL_ID)
  localStorageMgr.removeItem(STORAGE_APPROX_EXTENSION_INSTALL_TIME)
  localStorageMgr.removeItem(STORAGE_EXPERIMENT_ANON_USER)
}

/**
 * Log the user out.
 * @returns {Promise<boolean>}  A promise that resolves into a boolean,
 *   whether or not the logout was successful.
 */
export const logout = async () => {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Delete any sensitive localStorage items.
        clearAuthLocalStorageItems()

        // Sign-out successful.
        resolve(true)
      })
      .catch(e => {
        logger.error(e)
        resolve(false)
      })
  })
}

/**
 * Send a confirmation email to a Firebase user.
 * @param {object} firebaseUser - A Firebase user instance
 * @returns {Promise<boolean>}  A promise that resolves into a boolean,
 *   whether or not the email was sent successfully.
 */
const sendFirebaseVerificationEmail = async firebaseUser => {
  return new Promise((resolve, reject) => {
    try {
      // https://firebase.google.com/docs/auth/web/manage-users#send_a_user_a_verification_email
      firebaseUser
        .sendEmailVerification({
          // The "continue" URL after verifying.
          url: absoluteUrl(enterUsernameURL),
        })
        .then(() => {
          resolve(true)
        })
        .catch(err => {
          logger.error(err)
          resolve(false)
        })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Send an email for the current user to verify their email address.
 * @returns {Promise<boolean>}  A promise that resolves into a boolean,
 *   whether or not the email was sent successfully.
 */
export const sendVerificationEmail = async () => {
  try {
    const authUser = await getCurrentFirebaseUser()

    // If there is no current user, we cannot send an email.
    if (!authUser) {
      logger.error('Could not send confirmation email: no authenticated user.')
      return false
    }

    // Send the email.
    const emailSent = await sendFirebaseVerificationEmail(authUser)
    return emailSent
  } catch (e) {
    logger.error(e)
    return false
  }
}

/**
 * Sign in a user anonymously and return their user object.
 * @returns {Promise<{user}>} A Promise resolving into the
 *   user object.
 */
export const signInAnonymously = async () => {
  return new Promise((resolve, reject) => {
    // Should resolve into a non-null Firebase user credential.
    // https://firebase.google.com/docs/reference/js/firebase.auth.Auth?authuser=0#signInAnonymously
    firebase
      .auth()
      .signInAnonymously()
      .then(firebaseUserCredential => {
        // Format the user object and return it.
        const firebaseUser = firebaseUserCredential.user
        const formattedUser = firebaseUser ? formatUser(firebaseUser) : null
        resolve(formattedUser)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * Reload the Firebase user data from the server.
 * @returns {Promise<undefined>}
 */
export const reloadUser = async () => {
  var user
  try {
    user = await getCurrentFirebaseUser()
  } catch (e) {
    throw e
  }
  if (!user) {
    return
  }
  await user.reload()
}
