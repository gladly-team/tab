import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import HeartDonationCampaign from 'js/components/Campaign/HeartDonationCampaignComponent'

export default createFragmentContainer(HeartDonationCampaign, {
  app: graphql`
    fragment HeartDonationCampaignContainer_app on App {
      charity(charityId: $charityId) {
        id
        name
      }
    }
  `,
  user: graphql`
    fragment HeartDonationCampaignContainer_user on User {
      vcCurrent
    }
  `
})
