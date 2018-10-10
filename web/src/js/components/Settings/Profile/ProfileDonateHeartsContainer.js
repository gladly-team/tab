import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import ProfileDonateHearts from 'js/components/Settings/Profile/ProfileDonateHeartsComponent'

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
