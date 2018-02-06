'use strict'

import 'babel-polyfill' // For async/await support.
import config from '../config'
import logger from '../utils/logger'
import ReferralDataModel from '../database/referrals/ReferralDataModel'

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

export const migrateReferralData = async (referralData) => {
  // Log the referral data.
  try {
    await ReferralDataModel.create(migrationOverride, {
      userId: referralData.user_id,
      created: referralData.created,
      updated: referralData.created,
      referringUser: referralData.referring_user,
      referringChannel: referralData.referring_channel
    })
  } catch (e) {
    logger.error(new Error(`Could not log referrer data:
      referralData: ${JSON.stringify(referralData)},
      ${e}
    `))
    throw e
  }
  return true
}

export const handler = function (event) {
  var referralData
  try {
    referralData = JSON.parse(event.body)
  } catch (e) {
    logger.error(e)
    return Promise.resolve(createResponse(500, e))
  }

  // Check admin authorization
  const headers = event.headers
  if (!headers || headers['Authorization'] !== config.SENTRY_PRIVATE_KEY) {
    return Promise.resolve(createResponse(403, 'Not authorized.'))
  }

  return migrateReferralData(referralData)
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
