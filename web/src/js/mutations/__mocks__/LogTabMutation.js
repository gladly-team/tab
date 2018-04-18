/* eslint-env jest */

var onCompletedCallback = () => {}
var onErrorCallback = () => {}

// Mock Relay data returns
export const __runOnCompleted = (response = null) => {
  // Default response for this mutation's mock
  if (!response) {
    response = {
      logTab: {
        user: {
          id: 'abc',
          heartsUntilNextLevel: 10,
          level: 5,
          tabs: 2,
          vcCurrent: 45
        }
      }
    }
  }
  onCompletedCallback(response)
}

export const __runOnError = (response) => {
  onErrorCallback(response)
}

export default jest.fn((environment, userId, tabId, onCompleted = () => {}, onError = () => {}) => {
  onCompletedCallback = onCompleted
  onErrorCallback = onError
})
