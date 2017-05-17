import React from 'react';
import ConfirmationForm from './ConfirmationForm';
import TextField from 'material-ui/TextField';
import { login, getCurrentUser } from '../../utils/cognito-auth';
import { goTo, goToDashboard } from 'navigation/navigation';

import {
  blue500,
} from 'material-ui/styles/colors';

class LoginForm extends React.Component {
  
  constructor(props) {
    super(props);
    this.password = null;

    this.state = {
      password: null,
      confirmed: false,
    }
  }

  componentDidMount() {
    this.setState({
      confirmed: this.props.confirmed,
    })
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handleSubmit() {
  	if(this.password.input && this.password.input.value) {
      const password = this.password.input.value.trim();

      if(this.state.confirmed) {
        this.logUserIn(password, this.goToApp);
      } else {
        this.setState({
          password: password,
        });
      }
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

  goToApp() {
    getCurrentUser((user) => {
      if (user && user.sub) {
        goToDashboard();
      }
    });
  }

  onConfirmed() {
    this.logUserIn(this.state.password, this.goToCreateNewUser);
  }

  goToCreateNewUser() {
    goTo('/new-user');
  }

  render() {

    if(!this.state.confirmed && this.state.password) {
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
		      floatingLabelText="Enter your password"
		      floatingLabelStyle={floatingLabelStyle}
          type={"password"}
		      inputStyle={inputStyle}/>
		  </div>
    );
  }
}

LoginForm.propTypes = {
	email: React.PropTypes.string.isRequired,
  confirmed: React.PropTypes.bool,
} 

LoginForm.defaultProps = {
  confirmed: false,
} 

export default LoginForm;