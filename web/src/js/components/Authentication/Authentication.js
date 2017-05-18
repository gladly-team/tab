import React from 'react';
import EmailForm from './EmailForm';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ConfirmationForm from './ConfirmationForm';
import { getCurrentUser } from '../../utils/cognito-auth';
import { goTo, goToDashboard } from 'navigation/navigation';

class Authentication extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      email: null,
      login: false,
    };
  }

  componentDidMount() {
    getCurrentUser((user) => {
      if (user && user.sub) {
        goToDashboard();
      }
    });
  }

  onEmailSet(email) {
    this.setState({
      email: email,
      login: true,
    });
  }

  render() {
    const root = {
      height: '100%',
      width: '100%'
    };

    var currentState = (
      <EmailForm 
        onResponse={this.onEmailSet.bind(this)}/>);
    
    if(this.state.email && this.state.login) {
      currentState = (
          <LoginForm 
            email={this.state.email}/>);
    } 

    return (
      <div style={root}>
        {currentState}
      </div>
    );
  }
}

export default Authentication;

