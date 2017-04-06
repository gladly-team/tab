import React from 'react';
import Relay from 'react-relay';

class UserDisplay extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  render() {

    const { viewer } = this.props; 

    const sawasdee = {
      fontSize: '2.5em',
      fontWeight: 'normal',
    };

    return (
      <h1 style={sawasdee}>Welcome, {viewer.username}({viewer.email})</h1>
    );
  }
}

export default UserDisplay;