
import * as firebase from 'firebase'
import localStorageMgr from 'utils/localstorage-mgr'
import {
  STORAGE_KEY_USERNAME
} from '../constants'
import {
  absoluteUrl,
  enterUsernameURL
} from 'navigation/navigation'

/**
 * Get the username. This relies on localStorage, not our user database,
 * so that we can rely on it during the sign up process.
 * @returns {string} The user's username
 */
const getUsername = () => {
  return localStorageMgr.getItem(STORAGE_KEY_USERNAME)
}

/**
 * Take the user object from our auth service and create
 * the object we'll use in the app.
 * @returns {object} user - The user object for the app.
 * @returns {string} user.id - The user's ID
 * @returns {string} user.email - The user's email
 * @returns {string} user.username - The user's username
 * @returns {boolean} user.isAnonymous - Whether the user is anonymous
 * @returns {boolean} user.emailVerified - Whether the user has verified their email
 */
const formatUser = (authUserObj) => {
  return {
    id: authUserObj.uid,
    email: authUserObj.email,
    username: getUsername(),
    isAnonymous: authUserObj.isAnonymous,
    emailVerified: authUserObj.emailVerified
  }
}

/**
 * Return the raw Firebase user instance.
 * @returns {user} a Firebase User
 */
const getCurrentFirebaseUser = async () => {
  return new Promise((resolve, reject) => {
    try {
      // https://firebase.google.com/docs/auth/web/manage-users
      firebase.auth().onAuthStateChanged((authUser) => {
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
 * @returns {Promise<({user}|null)>}  A promise that resolves into either
 *   a user obejct or null.
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
 * Get the user's token
 * @returns {(string|null)} The token, if the user is authenticated;
 *   otherwise, null.
 */
export const getUserToken = async () => {
  try {
    const authUser = await getCurrentFirebaseUser()
    if (!authUser) {
      return null
    }
    const token = authUser.getIdToken()
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
 * Deletes any session-related localStorage items.
 * @returns {null}
 */
const clearAuthLocalStorageItems = () => {
  localStorageMgr.removeItem(STORAGE_KEY_USERNAME)
}

/**
 * Log the user out.
 * @returns {Promise<boolean>}  A promise that resolves into a boolean,
 *   whether or not the logout was successful.
 */
export const logout = async () => {
  return new Promise((resolve, reject) => {
    firebase.auth().signOut().then(() => {
      // Delete any session-related localStorage items.
      clearAuthLocalStorageItems()

      // Sign-out successful.
      resolve(true)
    }).catch((e) => {
      console.log(e)
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
const sendFirebaseVerificationEmail = async (firebaseUser) => {
  return new Promise((resolve, reject) => {
    try {
      // https://firebase.google.com/docs/auth/web/manage-users#send_a_user_a_verification_email
      firebaseUser.sendEmailVerification({
        // The "continue" URL after verifying.
        url: absoluteUrl(enterUsernameURL)
      }).then(() => {
        resolve(true)
      }).catch((err) => {
        console.error(err)
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
      return false
    }

    // Send the email.
    const emailSent = await sendFirebaseVerificationEmail(authUser)
    return emailSent
  } catch (e) {
    console.error(e)
    return false
  }
}
