
import { map } from 'lodash/collection'
import { cloneDeep } from 'lodash/lang'

const allFixtures = [
  {
    tableName: 'Users',
    jsonFile: 'UserData.json'
  },
  {
    tableName: 'Charities',
    jsonFile: 'CharityData.json'
  },
  {
    tableName: 'Features',
    jsonFile: 'FeatureData.json'
  },
  {
    tableName: 'UserLevels',
    jsonFile: 'UserLevels.json'
  },
  {
    tableName: 'VcDonationLog',
    jsonFile: 'VcDonationLog.json'
  },
  {
    tableName: 'BackgroundImages',
    jsonFile: 'BackgroundImages.json'
  },
  {
    tableName: 'Widgets',
    jsonFile: 'WidgetsData.json'
  },
  {
    tableName: 'UserWidgets',
    jsonFile: 'UserWidgetsData.json'
  }
]

const getFixtures = function () {
  // Add an appendix to the table name if required.
  const tableNameAppendix = (
    process.env.TABLE_NAME_APPENDIX
    ? process.env.TABLE_NAME_APPENDIX
    : ''
  )
  return map(allFixtures, (fixtureObj) => {
    const newFixtureObj = cloneDeep(fixtureObj)
    newFixtureObj.tableName = `${fixtureObj.tableName}${tableNameAppendix}`
    return newFixtureObj
  })
}

export default getFixtures
