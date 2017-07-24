'use strict'

import { get } from 'lodash/object'
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

  // TODO: move to own modules.
  // Get user authorization.
  const claims = get(event, 'requestContext.authorizer.claims', {})
  const userId = claims['sub']
  const username = claims['cognito:username']
  const emailVerified = claims['email_verified'] === 'true'
  if (!userId || !emailVerified) {
    console.log(userId, emailVerified)
    return Promise.resolve(createResponse(401, 'Request not authorized.'))
  }
  const context = {
    user: {
      id: userId,
      username: username,
      emailVerified: emailVerified
    }
  }
  return graphql(Schema, body.query, null, context, body.variables)
    .then(data => createResponse(200, data))
    .catch(err => createResponse(500, err))
}

export const serverlessHandler = function (event, context, callback) {
  handler(event)
    .then(response => callback(null, response))
}
