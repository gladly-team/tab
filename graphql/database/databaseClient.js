import config from '../config'

const AWS = require('aws-sdk')
AWS.config.update({
  region: config.AWS_REGION,
  endpoint: config.DYNAMODB_ENDPOINT
})

const dbClient = new AWS.DynamoDB.DocumentClient()

export default dbClient
