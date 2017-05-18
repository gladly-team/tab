import React from 'react';
import PropTypes from 'prop-types';
import {QueryRenderer} from 'react-relay/compat';
import environment from '../../../relay-env';
import ConfirmationForm from './ConfirmationForm';
import TextField from 'material-ui/TextField';
import { login, getOrCreate, getCurrentUser } from '../../utils/cognito-auth';
import { goTo, goToDashboard, goToLogin } from 'navigation/navigation';

import CreateNewUserMutation from 'mutations/CreateNewUserMutation';

import {
  blue500,
} from 'material-ui/styles/colors';

class LoginForm extends React.Component {
  
  constructor(props) {
    super(props);
    this.password = null;

    this.state = {
      password: null,
      created: false,
      confirmed: true,
    }
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handleSubmit() {
  	if(this.password.input && this.password.input.value) {
      const password = this.password.input.value.trim();

      getOrCreate(this.props.email, password, 
        (response, created, confirmed) => {
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
          console.error(err);
        })
  	}
  }

  logUserIn(password, success, failure) {
    login(this.props.email, password, (res) => {
        success();
      }, (err) => {
        if(failure)
          failure();
        console.error(err);
      });
  }

  onConfirmed() {
    this.logUserIn(this.state.password, this.createNewUser, (err) => {
      console.error(err);
    });
  }

  createNewUser() {
     getCurrentUser((user) => {
        if (user == null) {
          goToLogin();
        }

        const sub = user.sub;
        const email = user.email;

        CreateNewUserMutation.commit(
          environment,
          sub,
          email,
          (response) => {
            goToDashboard();
          },
          (err) => {
            console.error(err);
          }
        );
      });
  }

  render() {

    if(!this.state.confirmed) {
      return (<ConfirmationForm 
                email={this.props.email}
                onConfirmed={this.onConfirmed.bind(this)}/>);
    }
  	
  	const main = {
  		backgroundColor: blue500,
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
    		<TextField
    		  ref={(input) => { this.password = input; }}
    		  onKeyPress = {this._handleKeyPress.bind(this)}
		      floatingLabelText="Password"
		      floatingLabelStyle={floatingLabelStyle}
          type={"password"}
		      inputStyle={inputStyle}/>
		  </div>
    );
  }
}

LoginForm.propTypes = {
	email: PropTypes.string.isRequired,
} 

export default LoginForm;