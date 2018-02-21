/* eslint-env jest */

var onCompletedCallback = () => {}
var onErrorCallback = () => {}

var usernameArg = null

// Mock Relay data returns
export const __runOnCompleted = (response = null) => {
  // Default response for this mutation's mock
  if (!response) {
    response = {
      setUsername: {
        user: usernameArg,
        errors: null
      }
    }
  }
  onCompletedCallback(response)
}

export const __runOnError = (response) => {
  onErrorCallback(response)
}

export default jest.fn((environment, userId, username, onCompleted, onError) => {
  onCompletedCallback = onCompleted
  onErrorCallback = onError
  usernameArg = username
})
