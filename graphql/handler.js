'use strict'

import { graphql } from 'graphql'
import { Schema } from './data/schema'

const createResponse = function (statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS
    },
    body: JSON.stringify(body)
  }
}

// TODO: set up logging via Sentry.
export const handler = function (event) {
  var body
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    return Promise.resolve(createResponse(500, e))
  }
  const claims = event.requestContext.authorizer.claims

  console.log('----- Cognito Authorizer claims -----')
  console.log('sub', claims['sub'])
  console.log('email_verified', claims['email_verified'])
  console.log('cognito:username', claims['cognito:username'])

  // TODO: make sure email is verified and ID exists,
  // else return error.
  const context = {
    user: {
      id: claims['sub'],
      username: claims['cognito:username'],
      emailVerified: claims['email_verified'] === true
    }
  }
  console.log('context', context)
  return graphql(Schema, body.query, null, context, body.variables)
    .then(data => createResponse(200, data))
    .catch(err => createResponse(500, err))
}

export const serverlessHandler = function (event, context, callback) {
  handler(event)
    .then(response => callback(null, response))
}
