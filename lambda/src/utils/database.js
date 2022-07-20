import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const dynamoDb = new DynamoDB({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  // TODO: remove and rely on IAM role permissions.
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})
const documentClient = DynamoDBDocumentClient.from(dynamoDb)

const database = {}

database.put = params => documentClient.put(params).promise()

database.get = params => documentClient.get(params).promise()

export default database
