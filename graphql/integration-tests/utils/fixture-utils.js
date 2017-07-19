
import fs from 'fs'
import path from 'path'

import {
  tableNames,
  tableKeys,
  tableFixtureFileNames
} from './table-utils'

import AWS from './aws-client-dynamodb'
const docClient = new AWS.DynamoDB.DocumentClient()

const loadItemsIntoTable = async (items, tableName) => {
  const params = {
    RequestItems: {
      [tableName]: items.map((item) => {
        return {
          PutRequest: {
            Item: item
          }
        }
      })
    }
  }
  return docClient.batchWrite(params).promise()
      .then(response => {
        // console.log(`BatchWrite succeeded: ${JSON.stringify(items)}`)
      })
      .catch(err => {
        console.error(`Unable to batch write items. Error: ${err}`)
      })
}

const deleteItemsFromTable = async (items, tableName, hashKeyName, rangeKeyName) => {
  const params = {
    RequestItems: {
      [tableName]: items.map((item) => {
        // Construct the key values.
        const keyValues = {
          [hashKeyName]: item[hashKeyName]
        }
        if (rangeKeyName) {
          keyValues[rangeKeyName] = item[rangeKeyName]
        }
        return {
          DeleteRequest: {
            Key: keyValues
          }
        }
      })
    }
  }
  return docClient.batchWrite(params).promise()
      .then(response => {
        // console.log(`BatchWrite delete succeeded: ${JSON.stringify(items)}`)
      })
      .catch(err => {
        console.error(`Unable to batch delete items. Error: ${err}`)
      })
}

/**
 * Load fixture files into JSON, with string replacement.
 * @param {string} fileName - The name of the fixtures file.
 * @param {arr<object>} strReplacements - Strings to replace
 *   in the fixtures before using the fixtures. Objects should
 *   have both 'before' and 'after' keys.
 * @return {arr} The items loaded from `fileName` after
 *   string replacement.
 */
const getItemsFromJsonFile = function (fileName, strReplacements = []) {
  const filePath = path.join(__dirname, '../fixtures/', fileName)
  const fileStr = fs.readFileSync(filePath, 'utf8')

  // If needed, replace any strings in the fixtures before loading
  // them (e.g. replace a hardcoded user ID with a real user ID).
  var fileStrFinal = fileStr
  strReplacements.forEach((item) => {
    if (item.before && item.after) {
      fileStrFinal = fileStr.replace(item.before, item.after)
    }
  })
  const items = JSON.parse(fileStrFinal, 'utf8')
  return items
}

const loadFixturesIntoTable = async (fileName, tableName, strReplacements) => {
  const items = getItemsFromJsonFile(fileName, strReplacements)
  return loadItemsIntoTable(items, tableName)
}

const deleteFixturesFromTable = async (fileName, tableName, hashKeyName,
  strReplacements, rangeKeyName = null) => {
  const items = getItemsFromJsonFile(fileName, strReplacements)
  return deleteItemsFromTable(items, tableName, hashKeyName, rangeKeyName)
}

/**
 * Load fixtures for a table into the database. Before loading,
 *   do a string replacement for any string pairs provided in
 *   the `strReplacements` array.
 * @param {string} tableNameRef - The reference name of the table.
 * @param {arr<object>} strReplacements - Strings to replace
 *   in the fixtures before using the fixtures. Objects should
 *   have both 'before' and 'after' keys.
 * @return {Promise<arr>}  A promise that resolves into an array
 *   of objects from the fixtures file.
 */
export const loadFixtures = async (tableNameRef, strReplacements) => {
  const tableName = tableNames[tableNameRef]
  const fixtureFileName = tableFixtureFileNames[tableNameRef]
  return loadFixturesIntoTable(fixtureFileName, tableName, strReplacements)
}

/**
 * Delete fixture items from the database. Before deleting,
 *   do a string replacement for any string pairs provided in
 *   the `strReplacements` array.
 * @param {string} tableNameRef - The reference name of the table.
 * @param {arr<object>} strReplacements - Strings to replace
 *   in the fixtures before using the fixtures. Objects should
 *   have both 'before' and 'after' keys.
 * @return {Promise}
 */
export const deleteFixtures = async (tableNameRef, strReplacements) => {
  const tableName = tableNames[tableNameRef]
  const fixtureFileName = tableFixtureFileNames[tableNameRef]
  const hashKeyName = tableKeys[tableNameRef]['hash']
  const rangeKeyName = tableKeys[tableNameRef]['range']
  return deleteFixturesFromTable(fixtureFileName, tableName, hashKeyName,
      strReplacements, rangeKeyName)
}
