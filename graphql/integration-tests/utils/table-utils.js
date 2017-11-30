
import tables from '../../database/tables'

export const tableNames = tables

export const tableKeys = {
  users: {
    hash: 'id',
    range: null
  },
  userLevels: {
    hash: 'id',
    range: null
  },
  charities: {
    hash: 'id',
    range: null
  },
  vcDonationLog: {
    hash: 'id',
    range: null
  },
  backgroundImages: {
    hash: 'id',
    range: null
  },
  widgets: {
    hash: 'id',
    range: null
  },
  userWidgets: {
    hash: 'userId',
    range: 'widgetId'
  },
  userTabsLog: {
    hash: 'id',
    range: 'timestamp'
  },
  referralDataLog: {
    hash: 'userId',
    range: null
  }
}

export const tableFixtureFileNames = {
  users: 'Users.json',
  userLevels: 'UserLevels.json',
  charities: 'CharityData.json',
  vcDonationLog: 'VcDonationLog.json',
  backgroundImages: 'BackgroundImages.json',
  widgets: 'Widgets.json',
  userWidgets: 'UserWidgets.json',
  userTabsLog: '',
  referralDataLog: ''
}
