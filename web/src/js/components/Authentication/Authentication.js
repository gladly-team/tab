import React from 'react';
import SignUp from '../Signup/SignUp';
import SignIn from '../Login/SignIn';

class Authentication extends React.Component {

  render() {

    const root = {
      height: '100vh',
    };

    return (
      <div style={root}>
        <SignUp />
        <SignIn />
      </div>
    );
  }
}

export default Authentication;

