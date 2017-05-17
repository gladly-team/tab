import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { checkUserExist } from '../../utils/cognito-auth';

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
  	if(this.email.input && this.email.input.value) {
  		const email = this.email.input.value.trim();
  		checkUserExist(email, (_, confirmed) => {
  			this.props.onResponse(email, false, confirmed);
  		}, (_) => {
  			this.props.onResponse(email, true, false);
  		});
  	}
  }

  render() {
  	
  	const main = {
  		backgroundColor: deepPurple500,
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
    		  ref={(input) => { this.email = input; }}
    		  onKeyPress = {this._handleKeyPress.bind(this)}
		      floatingLabelText="Enter your email"
		      floatingLabelStyle={floatingLabelStyle}
		      inputStyle={inputStyle}/>
		</div>
    );
  }
}

EmailForm.propTypes = {
	onResponse: PropTypes.func.isRequired,
} 

export default EmailForm;