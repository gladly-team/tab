'use strict'

function handler (event, context, callback) {
  // This Lambda function returns a flag to indicate if a user should be auto-confirmed.
  // Access your resource which contains the list of emails of users who were invited to sign up

  event.response.autoConfirmUser = true
  event.response.autoVerifyEmail = true

  // Return result to Cognito
  context.done(null, event)
}

export {
    handler
}

// const handler = (event, context) => {
//   return new Promise((resolve, reject) => {
//     // This Lambda function returns a flag to indicate if a user should be auto-confirmed.
//     // Access your resource which contains the list of emails of users who were invited to sign up

//     event.response.autoConfirmUser = true
//     event.response.autoVerifyEmail = true

//     // Return result to Cognito
//     context.done(null, event)
//     resolve()
//   });
// }

// const serverlessHandler = (event, context, callback) => {
//   handler(event, context)
//     .then(response => callback(null, event))
// }

// module.exports = {
//   handler: handler,
//   serverlessHandler: serverlessHandler
// }

// const serverlessHandler = (event, context, callback) => {
//   // This Lambda function returns a flag to indicate if a user should be auto-confirmed.
//   // Access your resource which contains the list of emails of users who were invited to sign up

//   event.response.autoConfirmUser = true
//   event.response.autoVerifyEmail = true

//   // Return result to Cognito
//   context.done(null, event)
// }

// module.exports = {
//   serverlessHandler: serverlessHandler
// }
