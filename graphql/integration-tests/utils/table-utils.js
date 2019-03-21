import tables from '../../database/tables'

export const tableNames = tables

export const tableKeys = {
  users: {
    hash: 'id',
    range: null,
  },
  userLevels: {
    hash: 'id',
    range: null,
  },
  charities: {
    hash: 'id',
    range: null,
  },
  vcDonationLog: {
    hash: 'userId',
    range: 'timestamp',
  },
  vcDonationByCharity: {
    hash: 'charityId',
    range: 'timestamp',
  },
  userRevenueLog: {
    hash: 'userId',
    range: 'timestamp',
  },
  userDataConsentLog: {
    hash: 'userId',
    range: 'timestamp',
  },
  backgroundImages: {
    hash: 'id',
    range: null,
  },
  widgets: {
    hash: 'id',
    range: null,
  },
  userWidgets: {
    hash: 'userId',
    range: 'widgetId',
  },
  userTabsLog: {
    hash: 'userId',
    range: 'timestamp',
  },
  userSearchLog: {
    hash: 'userId',
    range: 'timestamp',
  },
  referralDataLog: {
    hash: 'userId',
    range: null,
  },
}

export const tableFixtureFileNames = {
  users: 'Users.json',
  userLevels: 'UserLevels.json',
  charities: 'CharityData.json',
  vcDonationLog: 'VcDonationLog.json',
  userDataConsentLog: 'UserDataConsentLog',
  backgroundImages: 'BackgroundImages.json',
  widgets: 'Widgets.json',
  userWidgets: 'UserWidgets.json',
  userTabsLog: '',
  userSearchLog: '',
  referralDataLog: 'ReferralDataLog.json',
}
