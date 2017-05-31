import AWS, {
  CognitoIdentityCredentials,
  Config
} from 'aws-sdk';

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';

const appConfig = {
  region: process.env.COGNITO_REGION,
  IdentityPoolId: process.env.COGNITO_IDENTITYPOOLID,
  UserPoolId: process.env.COGNITO_USERPOOLID,
  ClientId: process.env.COGNITO_CLIENTID
};

Config.region = appConfig.region;

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId,
});

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const MOCK_DEV_AUTHENTICATION = process.env.MOCK_DEV_AUTHENTICATION === 'true';

function checkUserExist(email, onSuccess, onFailure) {
	login(email, '', () => {}, (err) => {
		if(err.statusCode === 400) {
			if(err.code === 'UserNotFoundException') {
				onFailure(err);
			} else if(err.code === 'NotAuthorizedException') {
				onSuccess(err, true);
			} else if(err.code === 'UserNotConfirmedException') {
				onSuccess(err, false);
			}
		}
	});
}

//onSuccess(response, created, confirmed)
//onFailure(err)
function getOrCreate(email, password, onSuccess, onFailure) {
  login(
    email, 
    password, 
    (response) => onSuccess(response, false, true), 
    (err) => {
      if(err.statusCode === 400) {
        if(err.code === 'UserNotFoundException') {
          signup(email, password, (res) => onSuccess(res, true), onFailure);
        } else if(err.code === 'NotAuthorizedException') {
          onFailure(err);
        } else if(err.code === 'UserNotConfirmedException') {
          onSuccess(err);
        }
      }
  });
}

function login(email, password, onSuccessCallback, onFailureCallback) {

	var authenticationData = {
        Email: email,
        Password: password,
    };

    var authenticationDetails = new AuthenticationDetails(authenticationData);
    
    var userData = {
      Username: email,
      Pool: userPool
    };

    var cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {

        const cognitoArn = `cognito-idp.${appConfig.region}.amazonaws.com/${appConfig.UserPoolId}`;
        AWS.config.credentials = new CognitoIdentityCredentials({
          IdentityPoolId : appConfig.IdentityPoolId,
          Logins: {
            [cognitoArn]: result.getIdToken().getJwtToken(),
          },
        });

        onSuccessCallback(result);
      },
      onFailure: function(err) {
          onFailureCallback(err);
      },
    });
}

function signup(email, password, onSuccessCallback, onFailureCallback) {

	const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      })
    ];

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        onFailureCallback(err);
        return;
      }

      onSuccessCallback(result);
    });
}

function confirmRegistration(code, email, onSuccess, onFailure) {
    
    var userData = {
      Username: email,
      Pool: userPool
    };

    var cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
        	console.error(err);
        	onFailure(err);
        	return;
        }
        console.log(result);
        onSuccess(result);
    });
}

function resendConfirmation(email, onSuccess, onFailure) {
	var userData = {
      Username: email,
      Pool: userPool
    };

    var cognitoUser = new CognitoUser(userData);

    cognitoUser.resendConfirmationCode(function(err, result) {
        if (err) {
        	onFailure(err);
        	return;
        }
        onSuccess(result);
    });
}

function getCurrentUserForDev(callback) {
  callback({
    sub: process.env.DEV_AUTHENTICATED_USER,
  });
}

function getCurrentUser(callback) {
  // Mock the user authentication on development.
  // TODO: check for `IS_DEVELOPMENT` once we have a staging auth service
  if(MOCK_DEV_AUTHENTICATION) {
    getCurrentUserForDev(callback);
    return;
  }

	var cognitoUser = userPool.getCurrentUser();

  if (cognitoUser != null) {
    	cognitoUser.getSession(function(err, session) {
        if (err) {
          alert(err);
          return;
        }

        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
        cognitoUser.getUserAttributes(function(err, attributes) {
          if (err) {
            console.error(err);
            callback(null);
          } else {
            const user = {};
            var attribute;
            for(var index in attributes) {
            	attribute = attributes[index];
            	user[attribute.getName()] = attribute.getValue();
            }
            callback(user);
          }
        });
    });
  } else {
    callback(null);
  }
}

function logoutUser(callback) {
	var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.signOut();
    	callback(true)
    } else {
      callback(false);
    }
} 

function forgotPassword(email, onSuccess, onFailure) {
  var userData = {
    Username: email,
    Pool: userPool
  };

  var cognitoUser = new CognitoUser(userData);
  cognitoUser.forgotPassword({
        onSuccess: onSuccess,
        onFailure: onFailure
    });
}

function confirmPassword(email, verificationCode, newPassword, onSuccess, onFailure) {
  var userData = {
    Username: email,
    Pool: userPool
  };

  var cognitoUser = new CognitoUser(userData);
  cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: onSuccess,
      onFailure: onFailure,
  });
}

export {
	login,
	signup,
	confirmRegistration,
	resendConfirmation,
	getCurrentUser,
	logoutUser,
	checkUserExist,
  getOrCreate,
  forgotPassword,
  confirmPassword
}