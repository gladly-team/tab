/* eslint-env jest */

const firebaseApp = jest.genMockFromModule('firebase')

// Note: this module must be reset between tests if the tests
// modify default settings.

// By default, return no user.
var firebaseUser = null

// By default, do not immediately return a user from
// onAuthStateChanged.
var immediatelyReturnAuthUser = false

// Store callbacks for onAuthStateChanged so we can manually
// call them when changing the user state.
var onAuthStateChangedCallbacks = []

const authMock = {
  currentUser: firebaseUser,
  onAuthStateChanged: jest.fn(callback => {
    onAuthStateChangedCallbacks.push(callback)

    // Return the Firebase user immediately if one
    // was set with __setFirebaseUser. This makes
    // async testing a little easier.
    if (immediatelyReturnAuthUser) {
      callback(firebaseUser)
    }
  }),
  signInAnonymously: jest.fn(() => {
    // Should resolve into a non-null Firebase user credential.
    // https://firebase.google.com/docs/reference/js/firebase.auth.Auth?authuser=0#signInAnonymously
    // `firebaseUser` should be non-null, so we should call
    // `__setFirebaseUser` beforehand.
    return Promise.resolve({
      credential: {},
      user: firebaseUser,
      additionalUserInfo: {}
    })
  }),
  signOut: jest.fn(() => Promise.resolve()),
  signInAndRetrieveDataWithCredential: jest.fn(cred => {
    // Should resolve into a non-null Firebase user credential.
    return Promise.resolve({
      credential: {},
      user: firebaseUser,
      additionalUserInfo: {}
    })
  })
}

const FirebaseAuthMock = () => {
  return authMock
}

FirebaseAuthMock.EmailAuthProvider = {
  PROVIDER_ID: 'password'
}

FirebaseAuthMock.GoogleAuthProvider = {
  PROVIDER_ID: 'google.com'
}

FirebaseAuthMock.FacebookAuthProvider = {
  PROVIDER_ID: 'facebook.com'
}

firebaseApp.auth = FirebaseAuthMock

firebaseApp.__setFirebaseUser = (user) => {
  immediatelyReturnAuthUser = true
  firebaseUser = user
}

/**
 * Call all registered callbacks for the getCurrentUserListener
 * with a Firebase user object.
 * @param {Object} firebaseUser - An object resembling a Firebase
 *   user object
 * @return {function} A function to unsubscribe the listener
 */
firebaseApp.__triggerAuthStateChange = (firebaseUser) => {
  onAuthStateChangedCallbacks.forEach(cb => {
    cb(firebaseUser)
  })
}

/**
 * Reset all callbacks that we will call when the auth
 * state changes.
 * @return {undefined}
 */
firebaseApp.__unregisterAuthStateChangeListeners = () => {
  onAuthStateChangedCallbacks = []
}

module.exports = firebaseApp
