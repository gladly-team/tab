import React from 'react';
import PropTypes from 'prop-types';
import EmailField from 'general/EmailField';
import { checkUserExist, forgotPassword } from '../../utils/cognito-auth';
import { goToRetrievePassword } from 'navigation/navigation';

import {
  deepPurple500,
} from 'material-ui/styles/colors';

class EmailForm extends React.Component {
  constructor(props) {
    super(props);
    this.email = null;
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handleSubmit() {
  	if(this.email.validate()) {
  		const email = this.email.getValue();
      this.props.onResponse(email);
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
    		<EmailField
    		  ref={(input) => { this.email = input; }}
    		  onKeyPress = {this._handleKeyPress.bind(this)}
		      floatingLabelText="Email"
		      floatingLabelStyle={floatingLabelStyle}
		      inputStyle={inputStyle}/>
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