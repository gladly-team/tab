/* eslint-env jest */

var onCompletedCallback = () => {}
var onErrorCallback = () => {}

// Mock Relay data returns
export const __runOnCompleted = (response) => {
  onCompletedCallback(response)
}

export const __runOnError = (response) => {
  onErrorCallback(response)
}

export default jest.fn((environment, userId, onCompleted, onError) => {
  onCompletedCallback = onCompleted
  onErrorCallback = onError
})
