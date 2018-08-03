/* eslint-env jest */

const firebaseApp = jest.genMockFromModule('firebase')

// By default, return no user.
var firebaseUser = null

firebaseApp.auth = jest.fn(() => ({
  onAuthStateChanged: jest.fn(callback => {
    // Return the Firebase user.
    callback(firebaseUser)
  }),
  signOut: jest.fn()
}))

firebaseApp.__setFirebaseUser = (user) => {
  firebaseUser = user
}

module.exports = firebaseApp
