import { mapValues } from 'lodash/object'

const tableNameAppendix = process.env.DB_TABLE_NAME_APPENDIX
  ? process.env.DB_TABLE_NAME_APPENDIX
  : ''

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
