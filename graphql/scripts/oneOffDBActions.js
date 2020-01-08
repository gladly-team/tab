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

const fixIncorrectReferrerDec2019 = async () => {
  console.log('Fixing incorrect referrer data logs from December 2019.')
  const testId = require('./DBActionHelpers').fixIncorrectReferrerDec2019TestId()
  const info = await ReferralDataModel.get(adminAccess, testId)
  console.log(info)
}

const main = () => {
  // Modify this.
  fixIncorrectReferrerDec2019()
}

main()
