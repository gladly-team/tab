
import { find } from 'lodash/collection'
import config from '../../config'

const AWS = require('aws-sdk')
const awsRegion = config.AWS_REGION || 'us-west-2'
AWS.config.update({
  region: awsRegion,
  endpoint: `cognito-idp.${awsRegion}.amazonaws.com`,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fakeKey123',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fakeSecretKey123'
})
const cognitoIDP = new AWS.CognitoIdentityServiceProvider()

export const getUser = async (username) => {
  const params = {
    UserPoolId: config.COGNITO_USERPOOLID,
    Username: username
  }
  return cognitoIDP.adminGetUser(params)
    .promise()
    .catch((err) => {
      console.log('Could not get user.\n', err)
    })
}

export const deleteUser = async (username) => {
  const params = {
    UserPoolId: config.COGNITO_USERPOOLID,
    Username: username
  }
  return cognitoIDP.adminDeleteUser(params)
    .promise()
    .catch((err) => {
      console.log('Could not get user.\n', err)
    })
}

const createUser = async (email, username, password) => {
  const params = {
    UserPoolId: config.COGNITO_USERPOOLID,
    Username: username,
    UserAttributes: [
      {
        Name: 'email',
        Value: email
      },
      {
        Name: 'email_verified',
        Value: 'True'
      }
    ],
    DesiredDeliveryMediums: [],
    MessageAction: 'SUPPRESS',
    TemporaryPassword: password
  }
  return cognitoIDP.adminCreateUser(params)
    .promise()
    .catch((err) => {
      console.log('Could not create user.\n', err)
    })
}

const logIn = async (username, password) => {
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
      console.log('Could not initiate auth.\n', err)
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
      console.log('Could not authenticate user.\n', err)
    })
}

/**
 * Create a new user in AWS Cognito, log the user in, and
 *   return an object with user information.
 * @param {string} email - the user email to use in Cognito
 * @param {string} username - the username to use in Cognito
 * @param {string} username - the password to use in Cognito
 * @return {object}
 */
export const createUserAndLogIn = async (email, username, password) => {
  await createUser(email, username, password)
  const authResponse = await logIn(username, password)
  const idToken = authResponse.AuthenticationResult.IdToken
  const cognitoUser = await getUser(username)
  const userId = find(cognitoUser.UserAttributes,
    (obj) => obj.Name === 'sub').Value
  return {
    username: username,
    email: email,
    userId: userId,
    idToken: idToken
  }
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

/**
 * Create a new user in AWS Cognito, log the user in, and
 *   return an object with user information.
 * @return {object}
 */
export const getNewAuthedUser = async () => {
  const mockUser = getMockUserInfo()
  const userInfo = await createUserAndLogIn(
    mockUser.email, mockUser.username, mockUser.password)
  return userInfo
}
