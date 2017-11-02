import config from '../config'

const AWS = require('aws-sdk')
AWS.config.update({
  region: config.AWS_REGION,
  endpoint: config.DYNAMODB_ENDPOINT
})

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
const dbClient = new AWS.DynamoDB.DocumentClient({
  // allow empty string values by converting them to null
  convertEmptyValues: true
})

export default dbClient
