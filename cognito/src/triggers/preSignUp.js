'use strict'

/**
 * Returns a flag to indicate if a user should be auto-confirmed.
 * @param {Object} event - Cognito event.
 * @param {Object} context - Cognito context.
 * @param {Object} callback - Callback.
 */
function handler (event, context, callback) {
  event.response.autoConfirmUser = true
  event.response.autoVerifyEmail = true
  context.done(null, event)
}

export {
    handler
}
