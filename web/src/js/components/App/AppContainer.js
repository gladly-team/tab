// import Relay from 'react-relay';
// import App from './AppComponent';
// import VcUser from '../User/VcUserContainer';

// export default Relay.createContainer(App, {
//   fragments: {
//     viewer: () => Relay.QL`
//       fragment on User {
//         id
//       }`
//   }
// });


import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import App from './AppComponent';

export default createFragmentContainer(App, {
  viewer: graphql`
    fragment AppContainer_viewer on User {
      id
      username
      email
      level
    }
  `,
  user: graphql`
    fragment AppContainer_user on User {
      id
      username
      email
      level
    }
  `
});
