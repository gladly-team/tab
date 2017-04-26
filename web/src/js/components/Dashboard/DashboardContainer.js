import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import Dashboard from './DashboardComponent';

export default createFragmentContainer(Dashboard, {
  user: graphql`
    fragment DashboardContainer_user on User {
      ...UserDisplayContainer_user,
      ...UserBackgroundImageContainer_user,
      ...VcUserContainer_user
    }
  `
});
