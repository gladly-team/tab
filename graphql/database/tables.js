import { mapValues } from 'lodash/object'
import config from '../config'

const tableNameAppendix = config.DB_TABLE_NAME_APPENDIX
if (tableNameAppendix === undefined) {
  throw new Error(`The env variable "DB_TABLE_NAME_APPENDIX" must be defined.`)
}

const tables = {
  users: 'Users',
  userLevels: 'UserLevels',
  charities: 'Charities',
  vcDonationLog: 'VcDonationLog',
  vcDonationByCharity: 'VcDonationByCharity',
  userRevenueLog: 'UserRevenueLog',
  userDataConsentLog: 'UserDataConsentLog',
  backgroundImages: 'BackgroundImages',
  widgets: 'Widgets',
  userWidgets: 'UserWidgets',
  userTabsLog: 'UserTabsLog',
  userSearchLog: 'UserSearchLog',
  referralDataLog: 'ReferralDataLog',
  referralLinkClickLog: 'ReferralLinkClickLog',
}

export default mapValues(tables, name => `${name}${tableNameAppendix}`)
