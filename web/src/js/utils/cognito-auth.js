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
function getOrCreate (email, password, onSuccess, onFailure) {
  login(
    email,
    password,
    (response) => onSuccess(response, false, true),
    (err) => {
      if (err.statusCode === 400) {
        if (err.code === 'UserNotFoundException') {
          signup(email, password, (res) => onSuccess(res, true, res.userConfirmed), onFailure)
        } else if (err.code === 'NotAuthorizedException') {
          onFailure(err)
        } else if (err.code === 'UserNotConfirmedException') {
          onSuccess(err)
        }
      }
    })
}

function login (email, password, onSuccessCallback, onFailureCallback) {
  var authenticationData = {
    Email: email,
    Password: password
  }

  var authenticationDetails = new AuthenticationDetails(authenticationData)

  var userData = {
    Username: email,
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
}

function signup (email, password, onSuccessCallback, onFailureCallback) {
  const attributeList = [
    new CognitoUserAttribute({
      Name: 'email',
      Value: email
    })
  ]

  userPool.signUp(email, password, attributeList, null, (err, result) => {
    if (err) {
      onFailureCallback(err)
      return
    }
    console.log('signup', result)
    onSuccessCallback(result)
  })
}

function confirmRegistration (code, email, onSuccess, onFailure) {
  var userData = {
    Username: email,
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

function resendConfirmation (email, onSuccess, onFailure) {
  var userData = {
    Username: email,
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

function forgotPassword (email, onSuccess, onFailure) {
  var userData = {
    Username: email,
    Pool: userPool
  }

  var cognitoUser = new CognitoUser(userData)
  cognitoUser.forgotPassword({
    onSuccess: onSuccess,
    onFailure: onFailure
  })
}

function confirmPassword (email, verificationCode, newPassword, onSuccess, onFailure) {
  var userData = {
    Username: email,
    Pool: userPool
  }

  var cognitoUser = new CognitoUser(userData)
  cognitoUser.confirmPassword(verificationCode, newPassword, {
    onSuccess: onSuccess,
    onFailure: onFailure
  })
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
