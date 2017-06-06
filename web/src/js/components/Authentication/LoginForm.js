import React from 'react';
import PropTypes from 'prop-types';
import environment from '../../../relay-env';
import ConfirmationForm from './ConfirmationForm';
import PasswordField from 'general/PasswordField';
import Snackbar from 'material-ui/Snackbar';
import { login, getOrCreate, getCurrentUser } from '../../utils/cognito-auth';
import { goTo, goToDashboard, goToLogin } from 'navigation/navigation';
import { getReferralData } from 'web-utils';

import CreateNewUserMutation from 'mutations/CreateNewUserMutation';

import {
  indigo500,
} from 'material-ui/styles/colors';

class LoginForm extends React.Component {
  
  constructor(props) {
    super(props);
    this.password = null;

    this.state = {
      password: null,
      created: false,
      confirmed: true,
      alertOpen: false,
      alertMsg: '',
      createOnPasswordConfirm: false,
    }
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handleSubmit() {
  	if(this.password.validate()) {
      const password = this.password.getValue();
      getOrCreate(this.props.email, password, 
        (response, created, confirmed) => {
          if(this.state.createOnPasswordConfirm) {
            this.createNewUser();
            return;
          }

          if(!created && confirmed) {
            goToDashboard();
            return;
          } 

          this.setState({
            password: password,
            created: created,
            confirmed: confirmed,
          });
        },
        (err) => {
          this.showAlert(err.message);
        })
  	}
  }

  logUserIn(password, success, failure) {
    login(this.props.email, password, (res) => {
        success();
      }, (err) => {
        if(failure)
          failure(err);
      });
  }

  onConfirmed() {
    this.logUserIn(this.state.password, this.createNewUser, (err) => {
      this.showAlert(err.message);
      this.setState({
        confirmed: true,
        createOnPasswordConfirm: true,
      })
    });
  }

  createNewUser() {
     getCurrentUser((user) => {
        if (user == null) {
          goToLogin();
        }

        const sub = user.sub;
        const email = user.email;

        const referralData = getReferralData();

        CreateNewUserMutation.commit(
          environment,
          sub,
          email,
          referralData,
          (response) => {
            goToDashboard();
          },
          (err) => {
            console.error(err);
          }
        );
      });
  }

  handleAlertRequestClose(){
    this.setState({
      alertOpen: false,
      alertMsg: '',
    });
  }

  showAlert(msg) {
    this.setState({
      alertOpen: true,
      alertMsg: msg,
    });
  }

  render() {

    if(!this.state.confirmed) {
      return (<ConfirmationForm 
                email={this.props.email}
                onConfirmed={this.onConfirmed.bind(this)}/>);
    }
  	
  	const main = {
  		backgroundColor: indigo500,
  		height: '100%',
  		width: '100%',
  		display: 'flex',
  		justifyContent: 'center',
  		alignItems: 'center',
  	};

  	const floatingLabelStyle = {
  		color: '#FFF',
  	};

  	const inputStyle = {
  		color: '#FFF',
  	};

    return (
    	<div style={main}>
        <PasswordField 
          ref={(input) => { this.password = input; }}
          onKeyPress = {this._handleKeyPress.bind(this)}
          floatingLabelText="Password"
          floatingLabelStyle={floatingLabelStyle}
          type={"password"}
          inputStyle={inputStyle}
        />
        <Snackbar
          open={this.state.alertOpen}
          message={this.state.alertMsg}
          autoHideDuration={3000}
          onRequestClose={this.handleAlertRequestClose.bind(this)}
        />
		  </div>
    );
  }
}

LoginForm.propTypes = {
	email: PropTypes.string.isRequired,
} 

export default LoginForm;