
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
  referralDataLog: {
    hash: 'id',
    range: null
  }
}

export const tableFixtureFileNames = {
  users: 'Users.json',
  userLevels: '',
  charities: '',
  vcDonationLog: '',
  backgroundImages: '',
  widgets: 'widgets.json',
  userWidgets: 'UserWidgets.json',
  referralDataLog: ''
}
