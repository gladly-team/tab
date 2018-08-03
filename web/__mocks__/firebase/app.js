/* eslint-env jest */

const firebaseApp = jest.genMockFromModule('firebase')

// By default, return no user.
var firebaseUser = null

const FirebaseAuthMock = () => {
  return {
    onAuthStateChanged: jest.fn(callback => {
      // Return the Firebase user.
      callback(firebaseUser)
    }),
    signOut: jest.fn()
  }
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
  firebaseUser = user
}

module.exports = firebaseApp
