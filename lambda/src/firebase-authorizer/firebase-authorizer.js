/* eslint-disable standard/no-callback-literal */

import * as admin from 'firebase-admin'
import AWS from 'aws-sdk'

const encryptedFirebasePrivateKey = process.env['FIREBASE_PRIVATE_KEY']
let decryptedFirebasePrivateKey = ''

/*
 * Generate the AWS policy document to return from the authorizer.
 * Return an empty 'context' object if the user is denied access.
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html#api-gateway-custom-authorizer-output
 * @param {object} user - The user object from the decoded token.
 * @param {string} user.uid - The user's ID
 * @param {string} user.email - The user's email
 * @param {boolean} user.email_verified - Whether the user has verified their email
 * @param {boolean} allow - Whether the user is allowed access.
 * @param {string} resource - The AWS resource ARN the user wants to access.
 * @returns {object} The AWS policy
 */
const generatePolicy = function (user, allow, resource) {
  return {
    principalId: user.uid,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: allow ? 'Allow' : 'Deny',
          Resource: resource
        }
      ]
    },
    context: (
      allow
      ? {
        id: user.uid,
        email: user.email,
        email_verified: user.email_verified
      }
      : {}
    )
  }
}

function checkUserAuthorization (event, context, callback) {
  const token = event.authorizationToken
  if (!token) {
    callback('Error: Invalid token')
  }
  try {
    // Only initialize the app if it hasn't already been initialized.
    // https://groups.google.com/forum/#!topic/firebase-talk/aBonTOiQJWA
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // https://stackoverflow.com/a/41044630/1332513
          privateKey: decryptedFirebasePrivateKey.replace(/\\n/g, '\n')
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      })
    }

    // Validate the Firebase token.
    admin.auth().verifyIdToken(token)
      .then((decodedToken) => {
        const user = {
          uid: decodedToken.uid,
          email: decodedToken.email || null,
          email_verified: decodedToken.email_verified || false
        }

        // Conditions for authorization. We do not check for a valid
        // email because we create the user before email validation.
        const valid = !!user.uid

        // Generate AWS authorization policy
        callback(null, generatePolicy(user, valid, event.methodArn))
      }).catch((e) => {
        console.error(e)
        callback('Error: Invalid token')
      })
  } catch (e) {
    console.error(e)
    callback('Error: Invalid token')
  }
}

const handler = (event, context, callback) => {
  // Decrypt secure environment variables.
  if (decryptedFirebasePrivateKey) {
    checkUserAuthorization(event, context, callback)
  } else {
    // Decrypt code should run once and variables stored outside of the function
    // handler so that these are decrypted once per container
    const kms = new AWS.KMS()
    kms.decrypt({ CiphertextBlob: Buffer.from(encryptedFirebasePrivateKey, 'base64') }, (err, data) => {
      if (err) {
        console.log('Decrypt error:', err)
        callback('Error decrypting secure environnment variables.')
        return
      }
      decryptedFirebasePrivateKey = data.Plaintext.toString('ascii')
      checkUserAuthorization(event, context, callback)
    })
  }
}

const serverlessHandler = (event, context, callback) => {
  handler(event, context, callback)
}

module.exports = {
  handler: handler,
  serverlessHandler: serverlessHandler,
  checkUserAuthorization: checkUserAuthorization
}
