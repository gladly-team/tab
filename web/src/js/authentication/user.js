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
  STORAGE_NEW_USER_IS_TAB_V4_BETA,
} from 'js/constants'
import {
  absoluteUrl,
  loginURL,
  enterUsernameURL,
  constructUrl,
} from 'js/navigation/navigation'
import logger from 'js/utils/logger'
import DeleteUserMutation from 'js/mutations/DeleteUserMutation'
import environment from 'js/relay-env'

// Only for development.
const shouldMockAuthentication =
  process.env.REACT_APP_MOCK_DEV_AUTHENTICATION === 'true' &&
  process.env.NODE_ENV === 'development'

/**
 * Get the username. This uses localStorage, not our user database,
 * so that we can rely on it during the sign up process.
 * @return {String} The user's username
 */
export const getUsername = () => {
  return localStorageMgr.getItem(STORAGE_KEY_USERNAME)
}

/**
 * Set the username in localStorage.
 * @params {String} The user's username
 */
export const setUsernameInLocalStorage = username => {
  return localStorageMgr.setItem(STORAGE_KEY_USERNAME, username)
}

/**
 * Take the user object from our auth service and create
 * the object we'll use in the app.
 * @return {Object} AuthUser - The user object for the app.
 * @return {String} AuthUser.id - The user's ID
 * @return {String} AuthUser.email - The user's email
 * @return {String} AuthUser.username - The user's username
 * @return {Boolean} AuthUser.isAnonymous - Whether the user is anonymous
 * @return {Boolean} AuthUser.emailVerified - Whether the user has verified their email
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
const getMockFirebaseUser = async () => {
  const userId = 'abcdefghijklmno'
  const email = 'kevin@example.com'
  const tokenPayload = {
    sub: userId,
    email: 'kevin@example.com',
    email_verified: true,
  }
  const jose = require('jose')
  const secret = new TextEncoder().encode('fakeSecret')
  const token = await new jose.SignJWT(tokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret)
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
 * @return {Object} a Firebase User
 */
const getCurrentFirebaseUser = async () => {
  // For development only: optionally mock the user
  // and user token.
  if (shouldMockAuthentication) {
    return getMockFirebaseUser()
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
 * @return {Promise<({AuthUser}|null)>}  A promise that resolves into either
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
 * @param {Function} A function register a callback, which is called
 *   when the user's auth state changes and receives the new AuthUser
 *   object.
 * @return {Function} A function that, when called, will to unsubscribe
 *   the callback from future changes in authentication state.
 */
export const onAuthStateChanged = async callback => {
  // Return the listener unsubscribe function.
  // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged
  const unsubscribe = firebase.auth().onAuthStateChanged(async firebaseUser => {
    let user = null
    if (shouldMockAuthentication) {
      // For development only. Return a mock user.
      user = formatUser(await getMockFirebaseUser())
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
 * @return {(string|null)} The token, if the user is authenticated;
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
 * @return {null}
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
  localStorageMgr.removeItem(STORAGE_NEW_USER_IS_TAB_V4_BETA)
}

/**
 * Log the user out.
 * @return {Promise<Boolean>}  A promise that resolves into a boolean,
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
 * @param {Object} firebaseUser - A Firebase user instance
 * @return {Promise<Boolean>}  A promise that resolves into a boolean,
 *   whether or not the email was sent successfully.
 */
const sendFirebaseVerificationEmail = async (firebaseUser, { continueURL }) => {
  return new Promise((resolve, reject) => {
    try {
      // https://firebase.google.com/docs/auth/web/manage-users#send_a_user_a_verification_email
      firebaseUser
        .sendEmailVerification({
          // The "continue" URL after verifying. It must be absolute.
          url: continueURL,
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
 * @return {Promise<Boolean>}  A promise that resolves into a boolean,
 *   whether or not the email was sent successfully.
 */
export const sendVerificationEmail = async ({
  continueURL = absoluteUrl(enterUsernameURL),
} = {}) => {
  try {
    const authUser = await getCurrentFirebaseUser()

    // If there is no current user, we cannot send an email.
    if (!authUser) {
      logger.error('Could not send confirmation email: no authenticated user.')
      return false
    }

    // Send the email.
    const emailSent = await sendFirebaseVerificationEmail(authUser, {
      continueURL,
    })
    return emailSent
  } catch (e) {
    logger.error(e)
    return false
  }
}

/**
 * Sign in a user anonymously and return their user object.
 * @return {Promise<{AuthUser}>} A Promise resolving into the
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
 * @return {Promise<undefined>}
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

export const updateUserEmail = async newEmail => {
  // After verifying a new email, go to the login page with a
  // subsequent redirect to the account page + email change confirmation.
  const continueUrl = constructUrl(loginURL, { next: 3 }, { absolute: true })
  const user = firebase.auth().currentUser
  return user.verifyBeforeUpdateEmail(newEmail, { url: continueUrl })
}

export const deleteUser = async () => {
  return new Promise((resolve, reject) => {
    getCurrentUser()
      .then(user => {
        DeleteUserMutation(
          environment,
          user.id,
          () => {
            firebase
              .auth()
              .currentUser.delete()
              .then(() => {
                clearAuthLocalStorageItems()
                resolve(true)
              })
              .catch(error => {
                reject(error)
              })
          },
          response => {
            console.error('Error deleting user:')
            logger.error(response)
          }
        )
      })
      .catch(e => {
        logger.error(e)
        reject(e)
      })
  })
}
