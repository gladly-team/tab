import React from 'react';
import AWS, {
  Config,
  CognitoIdentityCredentials,
  CognitoIdentityServiceProvider
} from 'aws-sdk';

const appConfig = {
  region: process.env.COGNITO_REGION,
  IdentityPoolId: process.env.COGNITO_IDENTITYPOOLID,
  UserPoolId: process.env.COGNITO_USERPOOLID,
  ClientId: process.env.COGNITO_CLIENTID
};

AWS.config.region = appConfig.region;

class FacebookLogin extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const self = this;
    FB.getLoginStatus(function(response) {
        self.statusChangeCallback(response);
    });
  }

  statusChangeCallback(response) {
    // {
    //     status: 'connected',
    //     authResponse: {
    //         accessToken: '...',
    //         expiresIn:'...',
    //         signedRequest:'...',
    //         userID:'...'
    //     }
    // }
    console.log('Response from Facebook', response);
  }

  handleLogin() {


    FB.login(function (response) {

      console.log(response);

      // Check if the user logged in successfully.
      if (response.authResponse) {

        console.log('You are now logged in.');

        // Add the Facebook access token to the Cognito credentials login map.
        AWS.config.credentials = new CognitoIdentityCredentials({
          IdentityPoolId: 'us-west-2:a2050d3d-3dca-4a04-a2a3-7e4fb847e598',
          Logins: {
            'graph.facebook.com': response.authResponse.accessToken
          }
        });

        // // Obtain AWS credentials
        // Config.credentials.get(function(){
        //     // Access AWS resources here.
        // });

        AWS.config.credentials.get(function(err) {
          if (err) return console.log("Error", err);
          console.log("Cognito Credentials", AWS.config.credentials);
        });
      } else {
        console.log('There was a problem logging you in.');
      }

    }, {scope: 'public_profile,email'});
  }

  handleLogout() {
    FB.logout(function(response) {
      console.log('User is now logged out', response);
    });
  }


  render() {
    return (
      <div>
        <span onClick={this.handleLogin.bind(this)}>
          Facebook Login
        </span>
        <br/>
        <span onClick={this.handleLogout.bind(this)}>
          Facebook Logout
        </span>
      </div>
    );
  }
}

export default FacebookLogin;

