import AWS, {
  CognitoIdentityCredentials,
  Config
} from 'aws-sdk'

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js'

const appConfig = {
  region: process.env.COGNITO_REGION,
  IdentityPoolId: process.env.COGNITO_IDENTITYPOOLID,
  UserPoolId: process.env.COGNITO_USERPOOLID,
  ClientId: process.env.COGNITO_CLIENTID
}

Config.region = appConfig.region

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId
})

// const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
const MOCK_DEV_AUTHENTICATION = process.env.MOCK_DEV_AUTHENTICATION === 'true'

function checkUserExist (email, onSuccess, onFailure) {
  login(email, '', () => {}, (err) => {
    if (err.statusCode === 400) {
      if (err.code === 'UserNotFoundException') {
        onFailure(err)
      } else if (err.code === 'NotAuthorizedException') {
        onSuccess(err, true)
      } else if (err.code === 'UserNotConfirmedException') {
        onSuccess(err, false)
      }
    }
  })
}

// onSuccess(response, created, confirmed)
// onFailure(err)
function getOrCreate (username, email, password, onSuccess, onFailure) {
  login(
    username || email,
    password,
    (response) => onSuccess(response, false, true),
    (err) => {
      if (err.statusCode === 400) {
        if (err.code === 'UserNotFoundException') {
          signup(username, email, password, (res) => onSuccess(res, true, res.userConfirmed), onFailure)
        } else if (err.code === 'NotAuthorizedException') {
          onFailure(err)
        } else if (err.code === 'UserNotConfirmedException') {
          onSuccess(err)
        }
      }
    })
}

function login (username, password, onSuccessCallback, onFailureCallback) {
  var authenticationData = {
    Username: username,
    Password: password
  }

  var authenticationDetails = new AuthenticationDetails(authenticationData)

  var userData = {
    Username: username,
    Pool: userPool
  }

  var cognitoUser = new CognitoUser(userData)

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      const cognitoArn = `cognito-idp.${appConfig.region}.amazonaws.com/${appConfig.UserPoolId}`
      AWS.config.credentials = new CognitoIdentityCredentials({
        IdentityPoolId: appConfig.IdentityPoolId,
        Logins: {
          [cognitoArn]: result.getIdToken().getJwtToken()
        }
      })

      onSuccessCallback(result)
    },
    onFailure: function (err) {
      onFailureCallback(err)
    }
  })
  // If we want to integrate with Cognito Identity, we should
  // refresh credentials here (`AWS.config.credentials.refresh`).
  // https://github.com/aws/amazon-cognito-identity-js/issues/445#issuecomment-310452516
}

function signup (username, email, password, onSuccessCallback, onFailureCallback) {
  const attributeList = [
    new CognitoUserAttribute({
      Name: 'email',
      Value: email
    })
  ]

  userPool.signUp(username, password, attributeList, null, (err, result) => {
    if (err) {
      onFailureCallback(err)
      return
    }
    onSuccessCallback(result)
  })
}

function confirmRegistration (code, username, onSuccess, onFailure) {
  var userData = {
    Username: username,
    Pool: userPool
  }

  var cognitoUser = new CognitoUser(userData)

  cognitoUser.confirmRegistration(code, true, function (err, result) {
    if (err) {
      onFailure(err)
      return
    }
    onSuccess(result)
  })
}

function resendConfirmation (username, onSuccess, onFailure) {
  var userData = {
    Username: username,
    Pool: userPool
  }

  var cognitoUser = new CognitoUser(userData)

  cognitoUser.resendConfirmationCode(function (err, result) {
    if (err) {
      onFailure(err)
      return
    }
    onSuccess(result)
  })
}

const getUserIdToken = () => {
  return new Promise((resolve, reject) => {
    // Cognito handles ID token refreshing:
    // https://github.com/aws/amazon-cognito-identity-js/issues/245#issuecomment-271345763
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          resolve(null)
        }
        const idToken = session.getIdToken().getJwtToken()
        resolve(idToken)
      })
    } else {
      resolve(null)
    }
  })
}

function getCurrentUserForDev (getUserSub) {
  getUserSub({
    sub: process.env.DEV_AUTHENTICATED_USER
  })
}

function getCurrentUser (callback) {
  // Mock the user authentication on development.
  // TODO: check for `IS_DEVELOPMENT` once we have a staging auth service
  if (MOCK_DEV_AUTHENTICATION) {
    getCurrentUserForDev(callback)
    return
  }

  var cognitoUser = userPool.getCurrentUser()

  if (cognitoUser != null) {
    cognitoUser.getSession(function (err, session) {
      if (err) {
        callback(null)
        return
      }

        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
      cognitoUser.getUserAttributes(function (err, attributes) {
        if (err) {
          callback(null)
        } else {
          const user = {}
          var attribute
          for (var index in attributes) {
            attribute = attributes[index]
            user[attribute.getName()] = attribute.getValue()
          }
          callback(user)
        }
      })
    })
  } else {
    callback(null)
  }
}

function logoutUser (userLogoutCallback) {
  var cognitoUser = userPool.getCurrentUser()
  if (cognitoUser != null) {
    cognitoUser.signOut()
    userLogoutCallback(true)
  } else {
    userLogoutCallback(false)
  }
}

function forgotPassword (username, onSuccess, onFailure) {
  var userData = {
    Username: username,
    Pool: userPool
  }

  var cognitoUser = new CognitoUser(userData)
  cognitoUser.forgotPassword({
    onSuccess: onSuccess,
    onFailure: onFailure
  })
}

function confirmPassword (username, verificationCode, newPassword, onSuccess, onFailure) {
  var userData = {
    Username: username,
    Pool: userPool
  }

  var cognitoUser = new CognitoUser(userData)
  cognitoUser.confirmPassword(verificationCode, newPassword, {
    onSuccess: onSuccess,
    onFailure: onFailure
  })
}

// https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SignUp.html
function getMessageFromSignUpError (err) {
  switch (err.code) {
    case 'UsernameExistsException':
      return 'This username is taken.'
    case 'UserLambdaValidationException':
      return 'Please choose another username.'
    case 'InvalidPasswordException':
      return 'Password must be at least 8 characters long. '
    default:
      return "We're having a problem creating your account :("
  }
}

export {
  login,
  signup,
  confirmRegistration,
  resendConfirmation,
  getCurrentUser,
  getUserIdToken,
  logoutUser,
  checkUserExist,
  getOrCreate,
  forgotPassword,
  confirmPassword
}
