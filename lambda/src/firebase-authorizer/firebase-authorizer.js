/* eslint-disable standard/no-callback-literal */

import * as admin from 'firebase-admin'
import AWS from 'aws-sdk'

const encryptedFirebasePrivateKey = process.env['FIREBASE_PRIVATE_KEY']
let decryptedFirebasePrivateKey

/*
 * Generate the AWS policy document to return from the authorizer.
 * Return an empty 'context' object if the user is denied access.
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html#api-gateway-custom-authorizer-output
 * @param {object} user - The user object from the decoded token.
 * @param {string} user.uid - The user's ID
 * @param {string} user.email - The user's email
 * @param {string} user.username - The user's username
 * @param {boolean} user.isAnonymous - Whether the user is anonymous
 * @param {boolean} user.emailVerified - Whether the user has verified their email
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
        username: user.username,
        isAnonymous: user.isAnonymous,
        emailVerified: user.emailVerified
      }
      : {}
    )
  }
}

function checkUserAuthorization (event, context, callback) {
  console.log('checkUserAuthorization decryptedFirebasePrivateKey', decryptedFirebasePrivateKey)
  const token = event.authorizationToken
  if (!token) {
    callback('Error: Invalid token')
  }
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: decryptedFirebasePrivateKey
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    })

    // Validate the Firebase token.
    admin.auth().verifyIdToken(token)
      .then((decodedToken) => {
        const user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          username: decodedToken.username,
          isAnonymous: decodedToken.isAnonymous,
          emailVerified: decodedToken.emailVerified
        }
        const valid = user.uid && user.emailVerified

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
  console.log('firebase-authorizer handler')
  console.log('-------------------------------')
  console.log('encryptedFirebasePrivateKey', encryptedFirebasePrivateKey)
  console.log('-------------------------------')
  console.log('decryptedFirebasePrivateKey', decryptedFirebasePrivateKey)
  // Decrypt secure environment variables.
  if (decryptedFirebasePrivateKey) {
    checkUserAuthorization(event, context)
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
