// Execute from parent directory using
// `yarn run manage-fixtures [cmd]`.
// For cloud execution, set env vars DYNAMODB_ENDPOINT
// and AWS access keys.

import path from 'path'
import {
  deleteFixturesFromTable,
  loadFixturesIntoTable
} from '../graphql/integration-tests/utils/fixture-utils'

const args = process.argv.slice(2)
const command = args[0]
switch (command) {
  // load [table-name] [file-path]
  // e.g.:
  // yarn run manage-fixtures load BackgroundImages-dev ./migration/fixtures-prod/BackgroundImages.json
  case 'load':
    const tableNameToLoad = args[1]
    const fixturesFileToLoad = args[2]
    const fixturesFilePathToLoad = path.join(__dirname, '../', fixturesFileToLoad)
    console.log('Loading fixtures:', tableNameToLoad, fixturesFilePathToLoad)
    loadFixturesIntoTable(fixturesFilePathToLoad, tableNameToLoad)
      .then(() => {
        console.log('Finished loading fixtures.')
      })
      .catch((err) => {
        console.error(err)
      })
    break
  case 'delete':
    const tableNameToDelete = args[1]
    const fixturesFileToDelete = args[2]
    const hashKeyNameToDelete = args[3]
    const fixturesFilePathToDelete = path.join(__dirname, '../', fixturesFileToDelete)
    console.log('Deleting fixtures:', tableNameToDelete, fixturesFilePathToDelete)
    deleteFixturesFromTable(fixturesFilePathToDelete, tableNameToDelete, hashKeyNameToDelete)
      .then(() => {
        console.log('Finished deleting fixtures.')
      })
      .catch((err) => {
        console.error(err)
      })
    break
  default:
    console.log('Invalid command passed to manage-fixtures.')
    process.exit()
}
