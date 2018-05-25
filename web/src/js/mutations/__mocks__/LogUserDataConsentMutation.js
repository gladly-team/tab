/* eslint-env jest */

var onCompletedCallback = () => {}

// Mock Relay data returns
export const __runOnCompleted = (response = null) => {
  // Default response for this mutation's mock
  if (!response) {
    response = {
      logUserDataConsent: {
        success: true
      }
    }
  }
  onCompletedCallback(response)
}

export default jest.fn((environment, userId, consentString, isGlobalConsent, onCompleted = () => {}) => {
  onCompletedCallback = onCompleted
})
