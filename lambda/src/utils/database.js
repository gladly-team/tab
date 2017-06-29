'use strict'

import AWS from 'aws-sdk'
AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
var dynamoDb = new AWS.DynamoDB.DocumentClient()

var database = {}

database.put = function (params) {
  return dynamoDb.put(params).promise()
}

database.get = function (params) {
  return dynamoDb.get(params).promise()
}

export default database
