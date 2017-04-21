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
            name
            category
          }
        }
      }
    }
  `
});
