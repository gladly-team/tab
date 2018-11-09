import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import CampaignBase from 'js/components/Campaign/CampaignBase'

// Hardcode campaign-specific data requirements here, and remove
// after the campaign is no longer live.
export default createFragmentContainer(CampaignBase, {
  user: graphql`
    fragment CampaignBaseContainer_user on User {
      id
      ...HeartDonationCampaignContainer_user
    }
  `
})
