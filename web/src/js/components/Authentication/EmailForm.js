import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { checkUserExist, forgotPassword } from '../../utils/cognito-auth';
import { goToRetrievePassword } from 'navigation/navigation';

import {validateEmail} from 'web-utils';

import {
  deepPurple500,
} from 'material-ui/styles/colors';



class EmailForm extends React.Component {
  constructor(props) {
    super(props);

    this.email = null;
    this.state = {
      error: null,
    }
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
    if(this.state.error) {
      if(this.isValid() || !this.email.input.value) {
        this.setState({
          error: null,
        })
      }
    }
  }

  isValid() {
    if(!this.email.input || !this.email.input.value)
      return false;
    return validateEmail(this.email.input.value.trim());
  }

  handleSubmit() {
  	if(this.isValid()) {
  		const email = this.email.input.value.trim();
      this.props.onResponse(email);
  	} else {
      this.setState({
        error: 'Invalid email'
      })
    }
  }

  retrievePassword() {
    goToRetrievePassword();
  }

  render() {
  	
  	const main = {
  		backgroundColor: deepPurple500,
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

    const retrievePasswordContainer = {
      marginTop: 20,
      width: 256,
    }

    const retrievePasswordLink = {
      color: '#FFF',
      cursor: 'pointer',
      textAlign: 'left',
    }

    return (
    	<div style={main}>
    		<TextField
    		  ref={(input) => { this.email = input; }}
    		  onKeyPress = {this._handleKeyPress.bind(this)}
		      floatingLabelText="Email"
		      floatingLabelStyle={floatingLabelStyle}
		      inputStyle={inputStyle}
          errorText={this.state.error}
          value={'raul@gladly.io'}/>
        <div style={retrievePasswordContainer}>
          <span 
            style={retrievePasswordLink}
            onClick={this.retrievePassword.bind(this)}>Forgot your password?</span>
        </div>
		</div>
    );
  }
}

EmailForm.propTypes = {
	onResponse: PropTypes.func.isRequired,
} 

export default EmailForm;