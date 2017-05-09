import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import Charities from './CharitiesComponent';

export default createFragmentContainer(Charities, {
  app: graphql`
    fragment CharitiesContainer_app on App {
      charities(first: 20) {
        edges {
          node {
            id
            ...CharityContainer_charity
          }
        }
      }
    }
  `,
  user: graphql`
    fragment CharitiesContainer_user on User {
      ...CharityContainer_user
    }
  `
});
