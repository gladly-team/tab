import React from 'react';
import Relay from 'react-relay';
import {getUserToken} from '../utils/auth';

function userWrapper(component) {
  class UserWrapper extends React.Component {
    render() {
      return React.createElement(
        component,
        {
          viewer: this.props.viewer,
          user: this.props.viewer.user},
        this.props.children
      );
    }
  }

  return Relay.createContainer(UserWrapper, {
    initialVariables: {
      userId: getUserToken(),
    },

    fragments: {
      viewer: () => Relay.QL`
        fragment on Query {
          ${component.getFragment('viewer')}
          user(userId: $userId) {
            ${component.getFragment('user')}
          }
        }
      `,
    },
  });
}

export default userWrapper;
