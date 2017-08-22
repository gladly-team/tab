'use strict'

import { mapValues } from 'lodash/object'

const tableNameAppendix = (
  process.env.TABLE_NAME_APPENDIX
  ? process.env.TABLE_NAME_APPENDIX
  : ''
)

const tables = {
  features: 'Features',
  users: 'Users',
  userLevels: 'UserLevels',
  charities: 'Charities',
  vcDonationLog: 'VcDonationLog',
  backgroundImages: 'BackgroundImages',
  widgets: 'Widgets',
  userWidgets: 'UserWidgets',
  referralDataLog: 'ReferralDataLog'
}

export default mapValues(tables, (name) => `${name}${tableNameAppendix}`)
