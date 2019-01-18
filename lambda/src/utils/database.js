import AWS from 'aws-sdk'

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  // TODO: remove and rely on IAM role permissions.
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})
const dynamoDb = new AWS.DynamoDB.DocumentClient()

const database = {}

database.put = params => dynamoDb.put(params).promise()

database.get = params => dynamoDb.get(params).promise()

export default database
