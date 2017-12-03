'use strict'

import 'babel-polyfill' // For async/await support.
import config from '../config'
import logger from '../utils/logger'
import UserModel from '../database/users/UserModel'
import createUser from '../database/users/createUser'

import {
  getPermissionsOverride,
  MIGRATION_OVERRIDE
} from '../utils/permissions-overrides'
const migrationOverride = getPermissionsOverride(MIGRATION_OVERRIDE)

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

export const updateUserFields = async (user) => {
  try {
    const updatedUser = await UserModel.update(migrationOverride, {
      id: user.id,
      email: user.email,
      username: user.username,
      joined: user.joined,
      vcCurrent: user.vcCurrent,
      vcAllTime: user.vcAllTime,
      level: user.level,
      tabs: user.tabs,
      validTabs: user.validTabs,
      maxTabsDay: user.maxTabsDay,
      heartsUntilNextLevel: user.heartsUntilNextLevel,
      vcDonatedAllTime: user.vcDonatedAllTime,
      numUsersRecruited: user.numUsersRecruited,
      lastTabTimestamp: user.lastTabTimestamp
    })
    return updatedUser
  } catch (e) {
    throw e
  }
}

export const migrateUser = async (user) => {
  // Create user
  try {
    await createUser(migrationOverride, user.id, user.email)
  } catch (e) {
    throw e
  }

  // Update all user fields
  return updateUserFields(user)
}

export const handler = function (event) {
  var user
  try {
    user = JSON.parse(event.body)
  } catch (e) {
    logger.error(e)
    return Promise.resolve(createResponse(500, e))
  }

  // Check admin authorization
  const headers = event.headers
  if (!headers || headers['Authorization'] !== config.SENTRY_PRIVATE_KEY) {
    return Promise.resolve(createResponse(403, 'Not authorized.'))
  }

  return migrateUser(user)
    .then(response => createResponse(200, { status: 'success' }))
    .catch(err => {
      logger.error(err)
      return createResponse(500, err)
    })
}

export const serverlessHandler = function (event, context, callback) {
  handler(event)
    .then(response => callback(null, response))
}
