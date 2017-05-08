// import Relay from 'react-relay';
// import UserBackgroundImage from './UserBackgroundImageComponent';

// export default Relay.createContainer(UserBackgroundImage, {
//   fragments: {
//     viewer: () => Relay.QL`
//       fragment on User {
//         backgroundImage {
//   	      id
//   	      name
//   	      url
//   	    }
//       }`
//   }
// });

import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import UserBackgroundImage from './UserBackgroundImageComponent';

export default createFragmentContainer(UserBackgroundImage, {
  user: graphql`
    fragment UserBackgroundImageContainer_user on User {
      backgroundOption
      customImage
      backgroundColor
      backgroundImage {
        id
        name
        url
      }
    }
  `
});