// A script to put items into DynamoDB.
//
// Usage:
//
//   AWS_REGION=us-west-2 TABLE_NAME=Something-dev \
//   DYNAMODB_ENDPOINT=dynamodb.us-west-2.amazonaws.com \
//     node scripts/upload-data-to-ddb.js ./fixtures.json
//
// Test on local DynamoDB (localhost endpoint) before
// modifying dev/prod:
//
//   AWS_REGION=us-west-2 TABLE_NAME=Something \
//   DYNAMODB_ENDPOINT=http://localhost:8000 \
//     node scripts/upload-data-to-ddb.js ~/fixtures.json
//
/* eslint import/no-extraneous-dependencies: 0 */
import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'
import { fromIni } from '@aws-sdk/credential-providers'
import inquirer from 'inquirer'

// Expect one argument, the fixtures file.
const args = process.argv.slice(2)
const filePath = args[0]

// Update as needed.
const FIXTURES_FILE_PATH = path.resolve(filePath)
// eslint-disable-next-line prefer-destructuring
const TABLE_NAME = process.env.TABLE_NAME


const mfaCodeProvider = async serial => {
  try {
    const result = await inquirer.prompt({
      name: 'token',
      type: 'input',
      default: '',
      message: `MFA token for ${serial}:`,
    })
    return result.token
  } catch (e) {
    console.log('error:', e)
    throw e
  }
}

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

// To throttle large batches of data.
const SLEEP_MS_BETWEEN_QUERY_BATCHES = 100
function sleep(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const loadItemsIntoTable = async (items, tableName, docClient) => {
  const BATCH_MAX_ITEMS = 25
  let itemsToLoad = items
  if (items.length > BATCH_MAX_ITEMS) {
    await loadItemsIntoTable(items.slice(BATCH_MAX_ITEMS - 1), tableName, docClient)
    console.log(`Items loaded: ${items.length}`)
    if (SLEEP_MS_BETWEEN_QUERY_BATCHES > 0) {
      await sleep(SLEEP_MS_BETWEEN_QUERY_BATCHES)
    }
    itemsToLoad = items.slice(0, BATCH_MAX_ITEMS - 1)
  }
  const params = {
    RequestItems: {
      [tableName]: itemsToLoad.map((item) => ({
        PutRequest: {
          Item: item,
        },
      })),
    },
  }
  return docClient.batchWrite(params).promise()
}

const main = async () => {
  const credentialProvider = fromIni({
    mfaCodeProvider,
  })
  const data = JSON.parse(fs.readFileSync(FIXTURES_FILE_PATH, 'utf8'))
  const credentials = await credentialProvider()
  const docClient = new AWS.DynamoDB.DocumentClient({credentials})
  console.log(`Uploading ${data.length} items.`)
  console.log('Starting upload.')
  await loadItemsIntoTable(data, TABLE_NAME, docClient)
  console.log('Upload complete.')
}

;(async () => {
  await main()
})()

