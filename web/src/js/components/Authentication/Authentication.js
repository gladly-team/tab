import React from 'react';
import EmailForm from './EmailForm';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ConfirmationForm from './ConfirmationForm';
import { getCurrentUser, login } from '../../utils/cognito-auth';
import { goTo, goToDashboard } from 'navigation/navigation';
import SlideFromRightAnimation from 'general/SlideFromRightAnimation';
import SlideFromLeftAnimation from 'general/SlideFromLeftAnimation';

import { getUserCredentials } from '../../utils/tfac-mgr';

import appTheme from 'theme/default';

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
        return;
      }

      // Auto login from migration.
      // this.tryToLoginWithTfac();
    });

  }

  // Auto login from migration.
  tryToLoginWithTfac() {
    getUserCredentials()
      .then(user => {
          login(user.email, user.password, (res) => {
            goToDashboard();
          }, (err) => {
            console.log(err);
          });
      })
  }

  onEmailSet(email) {
    this.setState({
      email: email,
      login: true,
    });
  }

  onLoginBack() {
    this.setState({
      login: false,
    });
  }

  render() {
    var backgroundColor = appTheme.palette.primary1Color;
    var currentState = (
      <EmailForm 
        onResponse={this.onEmailSet.bind(this)}/>);

    if(this.state.email && !this.state.login) {
      backgroundColor = '#7C4DFF';
      currentState = (
        <SlideFromLeftAnimation
          enterAnimationTimeout={0}
          enter={true}>
            <EmailForm 
              email={this.state.email}
              onResponse={this.onEmailSet.bind(this)}/>
        </SlideFromLeftAnimation>);
    }
    
    if(this.state.email && this.state.login) {
      backgroundColor = appTheme.palette.primary1Color;

      currentState = (
        <SlideFromRightAnimation
          enterAnimationTimeout={0}
          enter={true}>
            <LoginForm
              onBack={this.onLoginBack.bind(this)} 
              email={this.state.email}/>
        </SlideFromRightAnimation>);
    } 

    const root = {
      height: '100%',
      width: '100%',
      backgroundColor: backgroundColor,
    };

    return (
          <div 
            style={root}>
            {currentState}
          </div>
    );
  }
}

export default Authentication;

