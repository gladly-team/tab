'use strict'

import 'babel-polyfill' // For async/await support.
import { graphql } from 'graphql'
import { Schema } from './data/schema'
import {
  createGraphQLContext,
  getUserClaimsFromLambdaEvent
} from './utils/authorization-helpers'
import { handleError } from './utils/error-logging'
import {
  loggerContextWrapper
} from './utils/logger'

// Note: we need to use Bluebird until at least Node 8. Using
// native promises breaks Sentry/Raven context:
// https://github.com/getsentry/raven-node/issues/265
global.Promise = require('bluebird')
const Promise = require('bluebird')

const createResponse = function (statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS
    },
    body: JSON.stringify(body)
  }
}

export const handler = function (event) {
  var body
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    return Promise.resolve(createResponse(500, e))
  }

  // Check user authorization.
  const claims = getUserClaimsFromLambdaEvent(event)
  const context = createGraphQLContext(claims)

  // Add context to any logs (e.g. the user and request data).
  return loggerContextWrapper(
    context.user,
    event,
    () => {
      return graphql(Schema, body.query, null, context, body.variables)
        .then(data => {
          // Check if the GraphQL response contains any errors, and
          // if it does, handle them.
          // See how express-graphql handles this:
          // https://github.com/graphql/express-graphql/blob/master/src/index.js#L301
          // If graphql-js gets a logger, we can move logging there:
          // https://github.com/graphql/graphql-js/issues/284
          if (data && data.errors) {
            data.errors = data.errors.map(err => handleError(err))
            return createResponse(500, data)
          }
          return createResponse(200, data)
        })
        .catch(err => {
          handleError(err)
          return createResponse(500, 'Internal Error')
        })
    }
  )
}

export const serverlessHandler = function (event, context, callback) {
  handler(event)
    .then(response => callback(null, response))
}
