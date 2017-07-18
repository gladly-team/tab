import config from '../../config'
var AWS = require('aws-sdk')

var dynamoDBEndpoint
if (!config.DYNAMODB_ENDPOINT) {
  dynamoDBEndpoint = 'http://localhost:8000'
  console.warn(`Env var DYNAMODB_ENDPOINT is not set. Using default ${dynamoDBEndpoint}.`)
} else {
  dynamoDBEndpoint = config.DYNAMODB_ENDPOINT
}

AWS.config.update({
  region: config.AWS_REGION || 'us-west-2',
  endpoint: dynamoDBEndpoint
})

module.exports = AWS
