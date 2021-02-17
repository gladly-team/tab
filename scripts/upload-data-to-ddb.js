// A script to put items into DynamoDB.
// Usage:
//   AWS_REGION=us-west-2 TABLE_NAME=Something DYNAMODB_ENDPOINT=SomeEndpoint \
//     node scripts/upload-data-to-ddb.js ./fixtures.json
/* eslint import/no-extraneous-dependencies: 0 */
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')

// Expect one argument, the fixtures file.
const args = process.argv.slice(2)
const filePath = args[0]

// Update as needed.
const FIXTURES_FILE_PATH = path.resolve(filePath)
// eslint-disable-next-line prefer-destructuring
const TABLE_NAME = process.env.TABLE_NAME

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const docClient = new AWS.DynamoDB.DocumentClient()

// To throttle large batches of data.
const SLEEP_MS_BETWEEN_QUERY_BATCHES = 100
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const loadItemsIntoTable = async (items, tableName) => {
  const BATCH_MAX_ITEMS = 25
  let itemsToLoad = items
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
      [tableName]: itemsToLoad.map(item => ({
        PutRequest: {
          Item: item,
        },
      })),
    },
  }
  return docClient.batchWrite(params).promise()
}

const main = async () => {
  const data = JSON.parse(fs.readFileSync(FIXTURES_FILE_PATH, 'utf8'))
  console.log(`Uploading ${data.length} items.`)
  console.log('Starting upload.')
  await loadItemsIntoTable(data, TABLE_NAME)
  console.log('Upload complete.')
}

main()
