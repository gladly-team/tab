
import * as admin from 'firebase-admin'
const AWS = require('aws-sdk')

const encryptedFirebasePrivateKey = process.env['FIREBASE_PRIVATE_KEY']
let decryptedFirebasePrivateKey

const createResponse = function (statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS
    },
    body: JSON.stringify(body)
  }
}

function processEvent (event, context) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: decryptedFirebasePrivateKey
      }),
      databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
    })
  } catch (e) {
    return createResponse(500, {
      error: e
    })
  }
  return createResponse(200, {
    message: 'Success!'
  })
}

const handler = (event, context) => {
  // Decrypt secure environment variables.
  if (decryptedFirebasePrivateKey) {
    processEvent(event, context)
  } else {
    // Decrypt code should run once and variables stored outside of the function
    // handler so that these are decrypted once per container
    const kms = new AWS.KMS()
    kms.decrypt({ CiphertextBlob: Buffer.from(encryptedFirebasePrivateKey, 'base64') }, (err, data) => {
      if (err) {
        console.log('Decrypt error:', err)
        return createResponse(500, 'Error decrypting secure environnment variables.')
      }
      decryptedFirebasePrivateKey = data.Plaintext.toString('ascii')
      processEvent(event, context)
    })
  }
}

const serverlessHandler = (event, context, callback) => {
  handler(event, context)
    .then(response => callback(null, response))
}

module.exports = {
  handler: handler,
  serverlessHandler: serverlessHandler
}
