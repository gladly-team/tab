import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import CampaignBase from './CampaignBase'

// Hardcoded for now.
// Remove campaign-specific data requirements after the
// campaign is no longer live.
export default createFragmentContainer(CampaignBase, {
  user: graphql`
    fragment CampaignBaseContainer_user on User {
      id
      ...StickerCampaignContainer_user
    }
  `
})
