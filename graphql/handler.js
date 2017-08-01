'use strict'

import 'babel-polyfill' // For async/await support.
import { graphql } from 'graphql'
import { Schema } from './data/schema'
import {
  createGraphQLContext,
  getUserClaimsFromLambdaEvent,
  isUserAuthorized
} from './utils/authorization-helpers'

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

  // Check user authorization.
  const claims = getUserClaimsFromLambdaEvent(event)
  if (!isUserAuthorized(claims)) {
    return Promise.resolve(createResponse(401, 'Request not authorized.'))
  }
  const context = createGraphQLContext(claims)
  return graphql(Schema, body.query, null, context, body.variables)
    .then(data => createResponse(200, data))
    .catch(err => createResponse(500, err))
}

export const serverlessHandler = function (event, context, callback) {
  handler(event)
    .then(response => callback(null, response))
}
