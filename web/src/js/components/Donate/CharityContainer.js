import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';

import Charity from './CharityComponent';

export default createFragmentContainer(Charity, {
  charity: graphql`
    fragment CharityContainer_charity on Charity {
      id
      name
      category
      logo
      image
      website
      description
      impact
    }
  `,
  user: graphql`
    fragment CharityContainer_user on User {
      id
      vcCurrent
    }
  `
});
