
import { mapValues } from 'lodash/object'
import config from '../config'

const tableNameAppendix = (
  config.TABLE_NAME_APPENDIX
  ? config.TABLE_NAME_APPENDIX
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
