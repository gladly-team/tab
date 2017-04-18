import React from 'react';
import Relay from 'react-relay';

class UserDisplay extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired
  };

  render() {

    const { user } = this.props; 

    const sawasdee = {
      fontSize: '2em',
      fontWeight: 'normal',
    };

    return (
      <h1 style={sawasdee}>Welcome, {user.username}</h1>
    );
  }
}

export default UserDisplay;