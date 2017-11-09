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

import localStorageMgr from './localstorage-mgr'
import { STORAGE_KEY_USER_ID } from '../constants'

// TODO: clean up this file. Use promises, add tests,
// possibly have a non-Cognito-specific interface.

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

// Tokens last an hour.
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

// Call Cognito to get the user.
function fetchCurrentUser (callback) {
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

// Keep the user in memory and don't duplicate
// requests to get the user.
// We may eventually want to have something like
// Redux handle this for us.
const userInfo = {
  _currUser: null,
  _fetchInProgress: false,
  _callbacks: [],

  getUser (callback) {
    // Mock the user authentication on development.
    // TODO: check for `IS_DEVELOPMENT` once we have a staging auth service
    if (MOCK_DEV_AUTHENTICATION) {
      getCurrentUserForDev(callback)
      return
    }

    // Return the user if we already fetched it.
    if (this._currUser) {
      callback(this._currUser)
      return
    }

    const self = this

    // Don't fetch again while a user fetch is already
    // in progress. Instead, save the callback to call
    // once the user is fetched.
    this._callbacks.push(callback)
    if (!this._fetchInProgress) {
      this._fetchInProgress = true
      fetchCurrentUser((fetchedUser) => {
        self._currUser = fetchedUser
        self._fetchInProgress = false
        self._callAllCallbacks()
      })
    }
  },

  clearUser () {
    this._currUser = null
  },

  _callAllCallbacks  () {
    const user = this._currUser
    this._callbacks.forEach((callback) => {
      if (typeof callback === 'function') {
        callback(user)
      }
    })

    // Clear callbacks.
    this._callbacks = []
  }
}

// Return the current user. Get the user from memory if it exists.
// If the user does not exist in memory, fetch the user from Cognito.
// However, if a fetch is currently in progress, wait for it to complete
// so we don't duplicate requests.
function getCurrentUser (callback) {
  userInfo.getUser(callback)
}

function getCurrentUserId (callback) {
  // Try to get ther user ID from local storage.
  // If it does not exist, get it from Cognito.
  const userId = localStorageMgr.getItem(STORAGE_KEY_USER_ID)

  if (userId) {
    callback(userId)
  } else {
    userInfo.getUser((user) => {
      if (!user || !user.sub) {
        callback(null)
      } else {
        callback(user.sub)
        localStorageMgr.setItem(STORAGE_KEY_USER_ID, user.sub)
      }
    })
  }
}

function logoutUser (userLogoutCallback) {
  var cognitoUser = userPool.getCurrentUser()
  if (cognitoUser != null) {
    cognitoUser.signOut()
  }

  // Clear the user from memory.
  localStorageMgr.removeItem(STORAGE_KEY_USER_ID)
  userInfo.clearUser()

  userLogoutCallback(true)
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
  getCurrentUserId,
  getUserIdToken,
  logoutUser,
  checkUserExist,
  getOrCreate,
  forgotPassword,
  confirmPassword,
  getMessageFromSignUpError
}
