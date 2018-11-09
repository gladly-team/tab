import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import HeartDonationCampaign from 'js/components/Campaign/HeartDonationCampaignComponent'

export default createFragmentContainer(HeartDonationCampaign, {
  user: graphql`
    fragment HeartDonationCampaignContainer_user on User {
      vcCurrent
    }
  `
})
