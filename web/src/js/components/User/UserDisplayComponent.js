import React from 'react';
import Relay from 'react-relay';

class UserDisplay extends React.Component {

  render() {
    const { user } = this.props;

    const container = {
      position: 'absolute',
      top: 10,
      right: 10,
    };

    const title = {
      color: 'white',
      fontSize: '1em',
      fontWeight: 'bold',
      margin: 0,
      fontFamily: "'Helvetica Neue', Roboto, 'Segoe UI', Calibri, sans-serif",
      padding: 12,
      cursor: 'pointer'
    };

    return (
      <span style={container}>
        <h1 style={title}>Welcome, {user.username}</h1>
      </span>
    );
  }
}

UserDisplay.propTypes = {
  user: React.PropTypes.object.isRequired
};

export default UserDisplay;