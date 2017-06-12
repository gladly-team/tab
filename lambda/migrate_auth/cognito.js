import AWS, {
  CognitoIdentityCredentials,
  Config,
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


function authenticateUser(email, password, onSuccessCallback, onFailureCallback) {

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
        cognitoUser.getUserAttributes(function(err, attributes) {
          if (err) {
            console.error(err);
            onFailureCallback(err);
          } else {
            const user = {};
            var attribute;
            for(var index in attributes) {
              attribute = attributes[index];
              user[attribute.getName()] = attribute.getValue();
            }
            onSuccessCallback(user);
          }
        });
      },
      onFailure: function(err) {
          onFailureCallback(err);
      },
    });
}

function registerUser(email, password, onSuccessCallback, onFailureCallback) {

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

      authenticateUser(
        email, 
        password, 
        (user) => {
          onSuccessCallback(user);
        },
        (error) => {
          onFailureCallback(error);
        });
    });
}

export {
	registerUser,
}