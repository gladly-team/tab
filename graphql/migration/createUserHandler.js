'use strict'

import 'babel-polyfill' // For async/await support.
import config from '../config'
import { handleError } from '../utils/error-logging'
import createUser from '../database/users/createUser'

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

const migrateUser = async (user) => {
  // Use getNextLevelFor to get user's remaining vc

  // TODO: create user with authorization override
  await createUser('TODO')

  // TODO: update all user fields
}

export const handler = function (event) {
  var body
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    return Promise.resolve(createResponse(500, e))
  }

  // Check admin authorization
  const headers = event.headers
  if (!headers || headers['Authorization'] !== config.MIGRATION_ADMIN_KEY) {
    return Promise.resolve(createResponse(403, 'Not authorized.'))
  }

  const user = body.user
  return migrateUser(user)
}

export const serverlessHandler = function (event, context, callback) {
  handler(event)
    .then(response => callback(null, response))
    .catch(err => {
      handleError(err)
      return createResponse(500, 'Internal Error')
    })
}
