
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
  const params = {
    UserPoolId: config.COGNITO_USERPOOLID,
    AttributesToGet: [
      'email'
    ],
    Limit: 10
  }
  return cognitoIDP.listUsers(params).promise()
}

export const getUser = async (username) => {
  const params = {
    UserPoolId: config.COGNITO_USERPOOLID,
    Username: username
  }
  return cognitoIDP.adminGetUser(params)
    .promise()
    .catch((err) => {
      throw new Error('Could not get user.', err)
    })
}

export const createUser = async (email, username, password) => {
  const params = {
    UserPoolId: config.COGNITO_USERPOOLID,
    Username: username,
    UserAttributes: [{
      Name: 'email',
      Value: email
    }],
    DesiredDeliveryMediums: [],
    MessageAction: 'SUPPRESS',
    TemporaryPassword: password
  }
  return cognitoIDP.adminCreateUser(params)
    .promise()
    .catch((err) => {
      throw new Error('Could not create user.', err)
    })
}

export const logIn = async (username, password) => {
  // Admin auth. See:
  // https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow.html#amazon-cognito-user-pools-admin-authentication-flow
  const initiateAuthParams = {
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    ClientId: config.COGNITO_CLIENTID,
    UserPoolId: config.COGNITO_USERPOOLID,
    AuthParameters: {
      'USERNAME': username,
      'PASSWORD': password
    }
  }
  const authInitResponse = await cognitoIDP
    .adminInitiateAuth(initiateAuthParams)
    .promise()
    .catch((err) => {
      throw new Error('Could not initiate auth.', err)
    })
  const userIdNonAlias = authInitResponse.ChallengeParameters.USER_ID_FOR_SRP
  const session = authInitResponse.Session

  // Log the user in.
  const params = {
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ClientId: config.COGNITO_CLIENTID,
    UserPoolId: config.COGNITO_USERPOOLID,
    ChallengeResponses: {
      'USERNAME': userIdNonAlias,
      'NEW_PASSWORD': password
    },
    Session: session
  }
  return cognitoIDP.adminRespondToAuthChallenge(params)
    .promise()
    .catch((err) => {
      throw new Error('Could not authenticate user.', err)
    })
}

export const createUserAndLogIn = async (email, username, password) => {
  await createUser(email, username, password)
  return logIn(username, password)
}

function randomString (length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export const getMockUserInfo = () => {
  const random = randomString(6)
  const username = `automatedtest+${random}`
  return {
    username: username,
    email: `${username}@gladly.io`,
    password: 'BadPassword123'
  }
}
