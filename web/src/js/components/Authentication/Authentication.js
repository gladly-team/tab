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
      newUser: false,
      confirmed: false
    };
  }

  componentDidMount() {
    getCurrentUser((user) => {
      if (user && user.sub) {
        goToDashboard();
      }
    });
  }

  onUserChecked(email, newUser, confirmed) {
    this.setState({
      email: email,
      newUser: newUser,
      confirmed: confirmed,
    });
  }

  render() {
    const root = {
      height: '100%',
      width: '100%'
    };

    var currentState = (
      <EmailForm 
        onResponse={this.onUserChecked.bind(this)}/>);
    
    if(this.state.email) {
      if(!this.state.newUser) {
        currentState = (
          <LoginForm 
            email={this.state.email}
            confirmed={this.state.confirmed}/>);
      } else {
        currentState = (
          <SignUpForm 
            email={this.state.email}/>);
      }
    } 

    return (
      <div style={root}>
        {currentState}
      </div>
    );
  }
}

// <SignUp onSignUp={this.onSignUp.bind(this)}/>
//         <SignIn onSignIn={this.onSignIn.bind(this)}/>

export default Authentication;

