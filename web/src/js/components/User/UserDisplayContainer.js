// import Relay from 'react-relay';
// import UserDisplay from './UserDisplayComponent';

// export default Relay.createContainer(UserDisplay, {
//   fragments: {
//     viewer: () => Relay.QL`
//       fragment on User {
//         id
//         username
//         email
//       }`
//   }
// });

import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

 import UserDisplay from './UserDisplayComponent';

export default createFragmentContainer(UserDisplay, {
  user: graphql`
    fragment UserDisplayContainer_user on User {
       id
       username
       email
    }
  `
});
