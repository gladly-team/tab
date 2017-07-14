
import fs from 'fs'
import path from 'path'

import AWS from './aws-client'
const docClient = new AWS.DynamoDB.DocumentClient()

export const loadItemsIntoTable = async (items, tableName) => {
  const promises = []
  items.forEach(function (item) {
    const params = {
      TableName: tableName,
      Item: item
    }

    promises.push(docClient.put(params).promise()
      .then(response => {
        // console.log(`PutItem succeeded: ${JSON.stringify(item)}`)
      })
      .catch(err => {
        console.error(`Unable to add item ${JSON.stringify(item)}. Error JSON: ${JSON.stringify(err, null, 2)}`)
      })
    )
  })
  return Promise.all(promises)
}

export const deleteItemsFromTable = async (items, tableName, hashKeyName, rangeKeyName) => {
  const promises = []
  items.forEach(function (item) {
    const keyValues = {
      [hashKeyName]: item[hashKeyName]
    }
    if (rangeKeyName) {
      keyValues[rangeKeyName] = item[rangeKeyName]
    }
    const params = {
      TableName: tableName,
      Key: keyValues
    }

    promises.push(docClient.delete(params).promise()
      .then(response => {
        // console.log(`DeleteItem succeeded: ${JSON.stringify(item)}`)
      })
      .catch(err => {
        console.error(`Unable to delete item ${JSON.stringify(item)}. Error JSON: ${JSON.stringify(err, null, 2)}`)
      })
    )
  })
  return Promise.all(promises)
}

export const getItemsFromJsonFile = function (fileName) {
  const filePath = path.join(__dirname, '../fixtures/', fileName)
  const items = JSON.parse(fs.readFileSync(filePath), 'utf8')
  return items
}

export const loadFixturesIntoTable = async (fileName, tableName) => {
  const items = getItemsFromJsonFile(fileName)
  return loadItemsIntoTable(items, tableName)
}

export const deleteFixturesFromTable = async (fileName, tableName, hashKeyName, rangeKeyName = null) => {
  const items = getItemsFromJsonFile(fileName)
  return deleteItemsFromTable(items, tableName, hashKeyName, rangeKeyName)
}
