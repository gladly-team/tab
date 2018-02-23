/* eslint-env jest */

var onCompletedCallback = () => {}
var onErrorCallback = () => {}

// Mock Relay data returns
export const __runOnCompleted = (response = null) => {
  onCompletedCallback(response)
}

export const __runOnError = (response) => {
  onErrorCallback(response)
}

export default jest.fn((environment, userId, email, referralData, onCompleted, onError) => {
  onCompletedCallback = onCompleted
  onErrorCallback = onError
})
