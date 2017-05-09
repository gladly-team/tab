import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import App from './AppComponent';

export default createFragmentContainer(App, {
  user: graphql`
    fragment AppContainer_user on User {
      id
      vcCurrent
      vcAllTime
      level
      heartsUntilNextLevel 
    }
  `
});
