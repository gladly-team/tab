/* eslint import/no-extraneous-dependencies: 0 */
import { map } from 'lodash/collection'
import { cloneDeep } from 'lodash/lang'

const allFixtures = [
  {
    tableName: 'Users',
    jsonFile: 'UserData.json',
  },
  {
    tableName: 'Charities',
    jsonFile: 'CharityData.json',
  },
  {
    tableName: 'UserImpact',
    jsonFile: 'UserImpactData.json',
  },
  {
    tableName: 'InvitedUsers',
    jsonFile: 'InvitedUsers.json',
  },
  {
    tableName: 'Missions',
    jsonFile: 'Missions.json',
  },
  {
    tableName: 'UserMissions',
    jsonFile: 'UserMissions.json',
  },
  {
    tableName: 'VideoAdLog',
    jsonFile: 'VideoAdLog.json',
  },
  {
    tableName: 'UserLevels',
    jsonFile: 'UserLevels.json',
  },
  {
    tableName: 'VcDonationLog',
    jsonFile: 'VcDonationLog.json',
  },
  {
    tableName: 'BackgroundImages',
    jsonFile: 'BackgroundImages.json',
  },
  {
    tableName: 'Widgets',
    jsonFile: 'WidgetsData.json',
  },
  {
    tableName: 'UserWidgets',
    jsonFile: 'UserWidgetsData.json',
  },
  {
    tableName: 'ReferralDataLog',
    jsonFile: 'ReferralDataLog.json',
  },
  {
    tableName: 'Causes',
    jsonFile: 'Causes.json',
  },
]

const getFixtures = () => {
  // Add an appendix to the table name if required.
  const tableNameAppendix = process.env.DB_TABLE_NAME_APPENDIX
    ? process.env.DB_TABLE_NAME_APPENDIX
    : ''
  return map(allFixtures, fixtureObj => {
    const newFixtureObj = cloneDeep(fixtureObj)
    newFixtureObj.tableName = `${fixtureObj.tableName}${tableNameAppendix}`
    return newFixtureObj
  })
}

export default getFixtures
