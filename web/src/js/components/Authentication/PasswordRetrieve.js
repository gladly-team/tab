import React from 'react';
import PropTypes from 'prop-types';
import CodeField from 'general/CodeField';
import PasswordField from 'general/PasswordField';
import EmailField from 'general/EmailField';
import { forgotPassword, confirmPassword, login } from '../../utils/cognito-auth';
import { goTo, goToDashboard, goToLogin } from 'navigation/navigation';
import Snackbar from 'material-ui/Snackbar';

import {
  indigo500,
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

  _setEmail(e) {
    if (e.key === 'Enter') {
      if(this.email.validate()) { 
        const email = this.email.getValue();
        this.sendPasswordRecoveryRequest(email);
      }
    }
  }

  sendPasswordRecoveryRequest(email) {
    forgotPassword(email, () => {
      this.setState({
        email: email,
      });
      this.showNotificationAlert('Check your email to get the confirmation code');
    }, (err) => {
      this.setState({
        email: null,
      });
      this.showNotificationAlert("We couldn't find an account that match this email");
    });
  }

  dataIsValid() {
    return this.code.validate() && this.password.validate();
  }

  _confirmPasswordHandler(e) {
     if (e.key === 'Enter') {
        if(this.dataIsValid()) { 
          const code = this.code.getValue();
          const password = this.password.getValue();
          this.confirmPasswordRequest(code, password);
        }
      }
  }

  confirmPasswordRequest(code, password) {
    confirmPassword(this.state.email, code, password, () => {
      this.logUserIn(this.state.email, password, goToDashboard);
    }, (err) => {
      this.showNotificationAlert(err.message);
    });
  }

  logUserIn(email, password, success, failure) {
    login(email, password, (res) => {
        success();
      }, (err) => {
        if(failure)
          failure(err);
      });
  }

  handleRequestClose() {
    this.setState({
      responseNotify: false,
      notificationMsg: '',
    });
  }

  showNotificationAlert(msg) {
    this.setState({
      responseNotify: true,
      notificationMsg: msg,
    });
  }

  render() {
  	
  	const main = {
  		backgroundColor: indigo500,
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
      email = (<EmailField
            ref={(input) => { this.email = input; }}
            onKeyPress = {this._setEmail.bind(this)}
            floatingLabelText="Email"
            floatingLabelStyle={floatingLabelStyle}
            inputStyle={inputStyle}/>);
    } else {
      code = (<CodeField
            ref={(input) => { this.code = input; }}
            onKeyPress = {this._confirmPasswordHandler.bind(this)}
            floatingLabelText="Enter your code"
            floatingLabelStyle={floatingLabelStyle}
            inputStyle={inputStyle}/>);
      password = (<PasswordField
            ref={(input) => { this.password = input; }}
            onKeyPress = {this._confirmPasswordHandler.bind(this)}
            floatingLabelText="Password"
            floatingLabelStyle={floatingLabelStyle}
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