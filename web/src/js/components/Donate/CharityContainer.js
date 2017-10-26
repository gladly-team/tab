import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import Charity from './CharityComponent'

export default createFragmentContainer(Charity, {
  charity: graphql`
    fragment CharityContainer_charity on Charity {
      id
      description
      image
      impact
      logo
      name
      website
    }
  `,
  user: graphql`
    fragment CharityContainer_user on User {
      id
      vcCurrent
    }
  `
})
