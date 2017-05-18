import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { forgotPassword } from '../../utils/cognito-auth';

import {
  red500,
} from 'material-ui/styles/colors';

class PasswordRetrieve extends React.Component {
  constructor(props) {
    super(props);

    this.email = null;
    this.state = {
      email: '',
      code: null,
      password: null,
    }
  }

  componentDidMount() {
    //forgotPassword(email);
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  isValid() {
    return this.email.input && this.email.input.value;
  }

  handleSubmit() {
  	if(this.isValid()) {
  		const email = this.email.input.value.trim();
      this.props.onResponse(email);
  	}
  }

  retrievePassword(email) {
    forgotPassword(email);
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

    return (
    	<div style={main}>
    		<TextField
    		  ref={(input) => { this.email = input; }}
    		  onKeyPress = {this._handleKeyPress.bind(this)}
		      floatingLabelText="Email"
		      floatingLabelStyle={floatingLabelStyle}
		      inputStyle={inputStyle}
          defaultValue={this.state.email}/>
		</div>
    );
  }
}

export default PasswordRetrieve;