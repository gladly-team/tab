
import {Config, CognitoIdentityCredentials} from 'aws-sdk';
import {
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';
import React from 'react';

const appConfig = {
  region: process.env.COGNITO_REGION,
  IdentityPoolId: process.env.COGNITO_IDENTITYPOOLID,
  UserPoolId: process.env.COGNITO_USERPOOLID,
  ClientId: process.env.COGNITO_CLIENTID
};

Config.region = appConfig.region;


Config.credentials = new CognitoIdentityCredentials({
  IdentityPoolId: appConfig.IdentityPoolId
});

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId,
});

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
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
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      })
    ];
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('user name is ' + result.user.getUsername());
      console.log('call result: ', result);
    });
  }

  render() {

    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div>Sign Up</div>
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

export default SignUp;
