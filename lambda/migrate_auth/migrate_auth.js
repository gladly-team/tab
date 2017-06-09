'use strict';

import {registerUser} from './cognito';
import tfac from './tfac_auth';

const handler = (event) => {

  // Check the received key in here to authenticate the request.
  if (!event.queryStringParameters.id) {
    return Promise.resolve({
      statusCode: 400,
      body: JSON.stringify({ message: 'The id query param must be set to a valid user id' }),
    });
  }

  let tfacId = event.queryStringParameters.id;
  let userEmail = event.queryStringParameters.email;
  let userPassword = 'SomePassword1';

  registerUser(
    userEmail, 
    userPassword, 
    (user) => {
      tfac.setCognitoCredentials(tfacId, {
        sub: user.sub,
        email: user.email,
        password: userPassword
      });
    },
    (error) => {
      console.log('An error ocurred while user registration', error);
    });

  return Promise.resolve({
    statusCode: 200,
    body: JSON.stringify({ message: 'User created.' }),
  });
};

const serverlessHandler = (event, context, callback) => {
  handler(event)
    .then( response => callback(null, response) );
}

module.exports = {
  handler: handler,
  serverlessHandler: serverlessHandler,
}

