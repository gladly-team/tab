/* eslint-env jest */

const authUserMock = jest.genMockFromModule('../user')
const authUserActual = jest.requireActual('../user')

authUserMock.logout = jest.fn(() => Promise.resolve(true))
authUserMock.getCurrentUser = jest.fn(() => Promise.resolve(null))

// Use the real formatUser function.
authUserMock.formatUser = authUserActual.formatUser

// Store callbacks for onAuthStateChanged so we can manually
// call them when changing the user state.
var onAuthStateChangedCallbacks = []
authUserMock.onAuthStateChanged = jest.fn(callback => {
  onAuthStateChangedCallbacks.push(callback)

  // Return a function to unregister the callback as
  // Firebase auth does.
  return () => {
    unregisterAuthStateListener(callback)
  }
})

authUserMock.signInAnonymously = jest.fn(() => {
  const mockAnonUserObj = {
    id: 'abc123xyz789',
    email: null,
    username: null,
    isAnonymous: true,
    emailVerified: false,
  }
  authUserMock.getCurrentUser.mockResolvedValue(mockAnonUserObj)
  return Promise.resolve(mockAnonUserObj)
})

/**
 * Find the matching function in the `onAuthStateChangedCallbacks`
 * array and remove it.
 * @param {function} listenerFunc - The previously-registered
 *   callback function
 * @return {undefined}
 */
const unregisterAuthStateListener = listenerFunc => {
  onAuthStateChangedCallbacks.forEach((cb, index) => {
    if (cb === listenerFunc) {
      onAuthStateChangedCallbacks.splice(index, 1)
    }
  })
}

/**
 * Call all registered callbacks for the getCurrentUserListener
 * with our auth user object.
 * @param {Object} authUser - Our auth user object
 * @return {function} A function to unsubscribe the listener
 */
authUserMock.__triggerAuthStateChange = authUser => {
  onAuthStateChangedCallbacks.forEach(cb => {
    cb(authUser)
  })
}

/**
 * Return the array of stored callback functions that we will
 * call when the auth state changes.
 * @return {Array} The value of `onAuthStateChangedCallbacks`
 */
authUserMock.__getAuthListenerCallbacks = () => {
  return onAuthStateChangedCallbacks
}

/**
 * Reset all callbacks that we will call when the auth
 * state changes.
 * @return {undefined}
 */
authUserMock.__unregisterAuthStateChangeListeners = () => {
  onAuthStateChangedCallbacks = []
}

module.exports = authUserMock
