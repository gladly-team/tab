/* eslint standard/no-callback-literal: 0, no-console: 0 */

import * as admin from 'firebase-admin'
import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms'
import { v4 as uuid } from 'uuid'

const encryptedFirebasePrivateKey = process.env.LAMBDA_FIREBASE_PRIVATE_KEY
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
const generatePolicy = (user, allow, resource) => {
  // AWS might use the principal ID for caching (though I could not
  // find documentation to confirm this). Though I can't think of
  // a clear security risk from setting a static principal ID for all
  // unauthenticated users, let's be cautious and generate unique
  // IDs for every request.
  // Related unanswered question:
  // https://stackoverflow.com/q/48762730
  const principalId = user.uid || `unauthenticated-${uuid()}`
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: allow ? 'Allow' : 'Deny',
          Resource: resource,
        },
      ],
    },
    context: allow
      ? {
          id: user.uid,
          email: user.email,
          email_verified: user.email_verified,
          auth_time: user.auth_time,
        }
      : {},
  }
}

const checkUserAuthorization = async event => {
  const token = event.headers.Authorization

  // If the request is unauthenticated, allow access but do not
  // provide any claims.
  // The client sends the "unauthenticated" placeholder value
  // because AWS API Gateway's custom authorizers will reject
  // any request without a token and we want to provide
  // unauthenticated access to our API.
  // "If a specified identify source is missing, null, or empty,
  // API Gateway returns a 401 Unauthorized response without calling
  // the authorizer Lambda function.”
  // https://docs.aws.amazon.com/apigateway/latest/developerguide/configure-api-gateway-lambda-authorization-with-console.html"
  if (token === 'unauthenticated') {
    const user = {
      uid: null,
      email: null,
      email_verified: false,
      auth_time: 0,
    }

    // Generate AWS authorization policy
    return generatePolicy(user, true, event.methodArn)
    // There is an authorization token, so validate it.
  }
  try {
    // Only initialize the app if it hasn't already been initialized.
    // https://groups.google.com/forum/#!topic/firebase-talk/aBonTOiQJWA
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.LAMBDA_FIREBASE_PROJECT_ID,
          clientEmail: process.env.LAMBDA_FIREBASE_CLIENT_EMAIL,
          // https://stackoverflow.com/a/41044630/1332513
          privateKey: decryptedFirebasePrivateKey.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.LAMBDA_FIREBASE_DATABASE_URL,
      })
    }
    // Validate the Firebase token.
    try {
      const decodedToken = await admin.auth().verifyIdToken(token)
      const user = {
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        email_verified: decodedToken.email_verified || false,
        auth_time: decodedToken.auth_time || 0,
      }

      // Conditions for authorization. We do not check for a valid
      // email because we create the user before email validation.
      const valid = !!user.uid

      // Generate AWS authorization policy
      return generatePolicy(user, valid, event.methodArn)
    } catch (e) {
      console.error(e)
      throw new Error('Error: Invalid token')
    }
  } catch (e) {
    console.error(e)
    throw new Error('Error: Invalid token')
  }
}

const handler = async event => {
  // Decrypt secure environment variables.
  if (decryptedFirebasePrivateKey) {
    return checkUserAuthorization(event)
  }
  // Decrypt code should run once and variables stored outside of the function
  // handler so that these are decrypted once per container
  const kms = new KMSClient()
  const decryptCommand = new DecryptCommand({
    CiphertextBlob: Buffer.from(encryptedFirebasePrivateKey, 'base64'),
  })
  try {
    const data = await kms.send(decryptCommand)
    // "When you use the HTTP API or the AWS CLI, the value is Base64-encoded.
    // Otherwise, it is not Base64-encoded."
    // https://docs.aws.amazon.com/kms/latest/APIReference/API_Decrypt.html#API_Decrypt_ResponseElements
    const privateKeyBase64Decoded = Buffer.from(data.Plaintext, 'base64')
    decryptedFirebasePrivateKey = privateKeyBase64Decoded.toString('ascii')
    return checkUserAuthorization(event)
  } catch (err) {
    console.log('Decrypt error:', err)
    throw new Error('Error decrypting secure environnment variables.')
  }
}

const serverlessHandler = async event => {
  return handler(event)
}

module.exports = {
  handler,
  serverlessHandler,
  checkUserAuthorization,
}
