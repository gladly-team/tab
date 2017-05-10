import AWS, {
  Config,
  CognitoIdentityCredentials,
  CognitoIdentityServiceProvider
} from 'aws-sdk';
import {
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import React from 'react';

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

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    console.log('Mounting component and getting user:');
    this.getUser();
  }

  getUser() {
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
        if (err) {
          alert(err);
          return;
        }
        console.log('session validity: ' + session.isValid());

        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
        cognitoUser.getUserAttributes(function(err, attributes) {
          if (err) {
            console.log(err);
            return;
          } else {
            attributes.forEach((attribute) => {
              console.log('Attribute ' + attribute.getName() + ' has value ' + attribute.getValue());
            });
          }
        });

        });
    }
    
    // cognitoUser.getUserAttributes(function(err, result) {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   for (let i = 0; i < result.length; i++) {
    //     console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
    //   }
    // });
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();

    var authenticationData = {
        Email: email,
        Password: password,
    };
    var authenticationDetails = new CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    var userData = {
      Username: email,
      Pool: userPool
    };
    var cognitoUser = new CognitoIdentityServiceProvider.CognitoUser(userData);

    const getUser = this.getUser;
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        console.log('access token:', result);

        const cognitoArn = `cognito-idp.${appConfig.region}.amazonaws.com/${appConfig.UserPoolId}`;
        console.log(cognitoArn);
        AWS.config.credentials = new CognitoIdentityCredentials({
          IdentityPoolId : appConfig.IdentityPoolId,
          Logins: {
            [cognitoArn]: result.getIdToken().getJwtToken(),
          },
        });

        getUser();
      },

      onFailure: function(err) {
          alert(err);
      },

    });
  }

  render() {

    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div>Sign In</div>
        <input type='text'
               value={this.state.email}
               placeholder='Email'
               onChange={this.handleEmailChange.bind(this)}/>
        <input type='password'
               value={this.state.password}
               placeholder='Password'
               onChange={this.handlePasswordChange.bind(this)}/>
        <input type='submit'/>
      </form>
    );
  }
}

export default SignIn;