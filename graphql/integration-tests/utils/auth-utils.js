
import config from '../../config'

const AWS = require('aws-sdk')
const awsRegion = config.AWS_REGION || 'us-west-2'
AWS.config.update({
  region: awsRegion,
  endpoint: `cognito-idp.${awsRegion}.amazonaws.com`,
  accessKeyId: config.AWS_ACCESS_KEY_ID || 'fakeKey123',
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY || 'fakeSecretKey123'
})
const cognitoIDP = new AWS.CognitoIdentityServiceProvider()

export const listUsers = async () => {
  const limit = 10
  var params = {
    UserPoolId: config.COGNITO_USERPOOLID,
    AttributesToGet: [
      'email'
    ],
    Limit: limit
  }
  return cognitoIDP.listUsers(params).promise()
}
