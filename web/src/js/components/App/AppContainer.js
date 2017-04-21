import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import App from './AppComponent';

export default createFragmentContainer(App, {
  viewer: graphql`
    fragment AppContainer_viewer on User {
      ...DashboardContainer_viewer
    }
  `
});
