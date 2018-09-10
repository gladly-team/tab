/* eslint-env jest */

var onCompletedCallback = () => {}
var onErrorCallback = () => {}

// Default response data from completed mutation.
var defaultSuccessResponse = {
  mergeIntoExistingUser: {
    user: {
      id: 'foo123',
      mergedIntoExistingUser: true
    }
  }
}

var defaultErrorResponse = null

// Mock Relay data returns
export const __runOnCompleted = (response = null) => {
  onCompletedCallback(response)
}

export const __runOnError = (response) => {
  onErrorCallback(response)
}

export const __setSuccessResponse = response => {
  defaultSuccessResponse = response
}

export const __setErrorResponse = response => {
  defaultErrorResponse = response
}

export default jest.fn((environment, userId, onCompleted, onError) => {
  onCompletedCallback = onCompleted
  onErrorCallback = onError

  // If any error or success responses are set, return them.
  if (defaultErrorResponse) {
    onError(defaultErrorResponse)
  }
  if (defaultSuccessResponse) {
    onCompletedCallback(defaultSuccessResponse)
  }
})
