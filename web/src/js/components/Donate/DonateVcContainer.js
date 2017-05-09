import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import DonateVc from './DonateVcComponent';

export default createFragmentContainer(DonateVc, {
  app: graphql`
    fragment DonateVcContainer_app on App {
      ...CharitiesContainer_app
    }
  `,
  user: graphql`
    fragment DonateVcContainer_user on User {
      id
      ...CharitiesContainer_user
    }
  `
});
