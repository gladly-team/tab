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
      ...VcUserContainer_user,
      ...BackgroundImagePickerContainer_user,
      ...DonateVcContainer_user,
      ...WidgetsContainer_user
    }
  `,
  app: graphql`
    fragment DashboardContainer_app on App {
      ...BackgroundImagePickerContainer_app,
      ...DonateVcContainer_app,
    }
  `
});
