import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import ProfileDonateHearts from './ProfileDonateHeartsComponent'

export default createFragmentContainer(ProfileDonateHearts, {
  app: graphql`
    fragment ProfileDonateHeartsContainer_app on App {
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
    fragment ProfileDonateHeartsContainer_user on User {
      ...CharityContainer_user
    }
  `
})
