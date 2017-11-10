
import * as firebase from 'firebase'

/**
 * Take the user object from our auth service and create
 * the object we'll use in the app.
 * @returns {object} The user object for the app.
 */
const formatUser = (authUserObj) => {
  return {
    id: authUserObj.uid,
    email: authUserObj.email,
    isAnonymous: authUserObj.isAnonymous
  }
}

/**
 * Get the current user object. Returns null if the user is not
 * logged in.
 * @returns {Promise<({user}|null)>}  A promise that resolves into either
 *   a user obejct or null.
 * @returns {string} user.id - The user's ID
 * @returns {string} user.email - The user's email
 * @returns {boolean} user.isAnonymous - Whether the user is anonymous
 */
export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    try {
      // https://firebase.google.com/docs/auth/web/manage-users
      firebase.auth().onAuthStateChanged((authUser) => {
        if (authUser) {
          resolve(formatUser(authUser))
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
 * Get the user's token
 * @returns {(string|null)} The token, if the user is authenticated;
 *   otherwise, null.
 */
export const getUserToken = async () => {
  return new Promise((resolve, reject) => {
    try {
      // https://firebase.google.com/docs/auth/web/manage-users
      firebase.auth().onAuthStateChanged((authUser) => {
        const token = authUser.getIdToken()
        if (token) {
          resolve(token)
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
 * Log the user out.
 * @returns {Promise<boolean>}  A promise that resolves into a boolean,
 *   whether or not the logout was successful.
 */
export const logout = async () => {
  return new Promise((resolve, reject) => {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      resolve(true)
    }).catch((e) => {
      console.log(e)
      resolve(false)
    })
  })
}
