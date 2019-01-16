import { mapValues } from 'lodash/object'
import config from '../config'

const tableNameAppendix = config.DB_TABLE_NAME_APPENDIX
  ? config.DB_TABLE_NAME_APPENDIX
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
  referralDataLog: 'ReferralDataLog',
}

export default mapValues(tables, name => `${name}${tableNameAppendix}`)
