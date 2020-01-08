/* eslint no-console: 0 */
import ReferralDataModel from '../database/referrals/ReferralDataModel'
import {
  getPermissionsOverride,
  ADMIN_MANAGEMENT,
} from '../utils/permissions-overrides'

const path = require('path')

const adminAccess = getPermissionsOverride(ADMIN_MANAGEMENT)

// This is a shell to run one-off scripts against DynamoDB.
// Run this with `npx babel-node ./scripts/oneOffDBActions`.
// Set the env variables required for databaseClient and modify
// code as needed.

// Load environment variables from .env file.
require('dotenv-extended').load({
  path: path.join(__dirname, '../../', '.env.local'),
  defaults: path.join(__dirname, '../../', '.env'),
})

// eslint-disable-next-line no-unused-vars
const fixIncorrectReferrerDec2019 = async () => {
  console.log('Fixing incorrect referrer data logs from December 2019.')
  const affectedIds = require('./DBActionHelpers').fixIncorrectReferrerDec2019AllIds()
  const logs = await ReferralDataModel.getBatch(adminAccess, affectedIds)
  console.log(`Number of logs: ${logs.length}`)

  // Update the referring channel.
  try {
    await Promise.all(
      logs.map(async item => {
        const updatedItem = {
          ...item,
          referringChannel: '305',
        }
        try {
          await ReferralDataModel.update(adminAccess, updatedItem)
        } catch (e) {
          throw e
        }
      })
    )
  } catch (e) {
    throw e
  }

  console.log('Finished.')
}

const main = async () => {
  try {
    // Add code here.
    console.log('Add code to the `main` function to run a script.')
  } catch (e) {
    throw e
  }
}

main()
