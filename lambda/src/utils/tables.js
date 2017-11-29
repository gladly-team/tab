'use strict'

import { mapValues } from 'lodash/object'

const tableNameAppendix = (
  process.env.TABLE_NAME_APPENDIX
  ? process.env.TABLE_NAME_APPENDIX
  : ''
)

const tables = {
  users: 'Users',
  userLevels: 'UserLevels',
  charities: 'Charities',
  vcDonationLog: 'VcDonationLog',
  backgroundImages: 'BackgroundImages',
  widgets: 'Widgets',
  userWidgets: 'UserWidgets',
  userTabsLog: 'UserTabsLog',
  referralDataLog: 'ReferralDataLog'
}

export default mapValues(tables, (name) => `${name}${tableNameAppendix}`)
