import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { forgotPassword, confirmPassword, login } from '../../utils/cognito-auth';
import { goTo, goToDashboard, goToLogin } from 'navigation/navigation';
import Snackbar from 'material-ui/Snackbar';

import {
  red500,
} from 'material-ui/styles/colors';

class PasswordRetrieve extends React.Component {
  constructor(props) {
    super(props);
    this.email = null;
    this.code = null;
    this.password = null;

    this.state = {
      email: null,
      responseNotify: false,
      notificationMsg: '',
    }
  }

  isValid() {
    return this.email.input && this.email.input.value;
  }

  _setEmail(e) {
    if (e.key === 'Enter') {
      if(this.isValid()) { 
        const email = this.email.input.value.trim();
        this.sendPasswordRecoveryRequest(email);
      }
    }
  }

  sendPasswordRecoveryRequest(email) {
    forgotPassword(email, () => {
      console.log('sendPasswordRecoveryRequest success');
      this.setState({
        email: email,
        responseNotify: true,
        notificationMsg: 'Check your email to get the confirmation code',
      });
    }, (err) => {
      console.log('sendPasswordRecoveryRequest error', err);
      this.setState({
        email: null,
        responseNotify: true,
        notificationMsg: "We couldn't find an account that match this email",
      });
    });
  }

  dataIsValid() {
    return this.code.input && 
           this.code.input.value &&
           this.password.input && 
           this.password.input.value;
  }

  _confirmPasswordHandler(e) {
     if (e.key === 'Enter') {
        if(this.dataIsValid()) { 
          const code = this.code.input.value.trim();
          const password = this.password.input.value.trim();
          this.confirmPasswordRequest(code, password);
        }
      }
  }

  confirmPasswordRequest(code, password) {
    confirmPassword(this.state.email, code, password, () => {
      this.logUserIn(this.state.email, password, goToDashboard);
    }, (err) => {
      console.error(err);
    });
  }

  logUserIn(email, password, success, failure) {
    login(email, password, (res) => {
        success();
      }, (err) => {
        if(failure)
          failure();
        console.error(err);
      });
  }

  handleRequestClose() {
    this.setState({
      responseNotify: false,
      notificationMsg: '',
    });
  }

  render() {
  	
  	const main = {
  		backgroundColor: red500,
  		height: '100%',
  		width: '100%',
  		display: 'flex',
      flexDirection: 'column',
  		justifyContent: 'center',
  		alignItems: 'center',
  	};

  	const floatingLabelStyle = {
  		color: '#FFF',
  	};

  	const inputStyle = {
  		color: '#FFF',
  	};

    var email;
    var code;
    var password;
    if(!this.state.email) {
      email = (<TextField
            ref={(input) => { this.email = input; }}
            onKeyPress = {this._setEmail.bind(this)}
            floatingLabelText="Email"
            floatingLabelStyle={floatingLabelStyle}
            inputStyle={inputStyle}/>);
    } else {
      code = (<TextField
            ref={(input) => { this.code = input; }}
            onKeyPress = {this._confirmPasswordHandler.bind(this)}
            floatingLabelText="Enter your code"
            floatingLabelStyle={floatingLabelStyle}
            inputStyle={inputStyle}/>);
      password = (<TextField
            ref={(input) => { this.password = input; }}
            onKeyPress = {this._confirmPasswordHandler.bind(this)}
            floatingLabelText="Password"
            floatingLabelStyle={floatingLabelStyle}
            type={"password"}
            inputStyle={inputStyle}/>);
    }

    return (
      <div style={main}>
        {email}
        {code}
        {password}
        <Snackbar
            open={this.state.responseNotify}
            message={this.state.notificationMsg}
            autoHideDuration={3000}
            onRequestClose={this.handleRequestClose.bind(this)}/>
      </div>
    );
  }
}

export default PasswordRetrieve;