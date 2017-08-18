
import fs from 'fs'
import path from 'path'

import {
  tableNames,
  tableKeys,
  tableFixtureFileNames
} from './table-utils'

import AWS from './aws-client-dynamodb'
const docClient = new AWS.DynamoDB.DocumentClient()

// Consider simplifying fixtures by using factories, e.g.:
// https://github.com/aexmachina/factory-girl

// To throttle large batches of data.
const SLEEP_MS_BETWEEN_QUERY_BATCHES = 100
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const loadItemsIntoTable = async (items, tableName) => {
  const BATCH_MAX_ITEMS = 25
  var itemsToLoad = items
  if (items.length > BATCH_MAX_ITEMS) {
    await loadItemsIntoTable(items.slice(BATCH_MAX_ITEMS - 1), tableName)
    console.log(`Items loaded: ${items.length}`)
    if (SLEEP_MS_BETWEEN_QUERY_BATCHES > 0) {
      await sleep(SLEEP_MS_BETWEEN_QUERY_BATCHES)
    }
    itemsToLoad = items.slice(0, BATCH_MAX_ITEMS - 1)
  }
  const params = {
    RequestItems: {
      [tableName]: itemsToLoad.map((item) => {
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
  const BATCH_MAX_ITEMS = 25
  var itemsToDelete = items
  if (items.length > BATCH_MAX_ITEMS) {
    await deleteItemsFromTable(items.slice(BATCH_MAX_ITEMS - 1),
      tableName, hashKeyName, rangeKeyName)
    if (SLEEP_MS_BETWEEN_QUERY_BATCHES > 0) {
      await sleep(SLEEP_MS_BETWEEN_QUERY_BATCHES)
    }
    itemsToDelete = items.slice(0, BATCH_MAX_ITEMS - 1)
  }
  const params = {
    RequestItems: {
      [tableName]: itemsToDelete.map((item) => {
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
 * @param {string} filePath - The path of the fixtures file.
 * @param {arr<object>} strReplacements - Strings to replace
 *   in the fixtures before using the fixtures. Objects should
 *   have both 'before' and 'after' keys.
 * @return {arr} The items loaded from `fileName` after
 *   string replacement.
 */
const getItemsFromJsonFile = function (filePath, strReplacements = []) {
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

export const loadFixturesIntoTable = async (filePath, tableName, strReplacements) => {
  const items = getItemsFromJsonFile(filePath, strReplacements)
  return loadItemsIntoTable(items, tableName)
}

export const deleteFixturesFromTable = async (filePath, tableName, hashKeyName,
  strReplacements, rangeKeyName = null) => {
  const items = getItemsFromJsonFile(filePath, strReplacements)
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
  const filePath = path.join(__dirname, '../fixtures/', fixtureFileName)
  return loadFixturesIntoTable(filePath, tableName, strReplacements)
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
  const filePath = path.join(__dirname, '../fixtures/', fixtureFileName)
  const hashKeyName = tableKeys[tableNameRef]['hash']
  const rangeKeyName = tableKeys[tableNameRef]['range']
  return deleteFixturesFromTable(filePath, tableName, hashKeyName,
      strReplacements, rangeKeyName)
}
