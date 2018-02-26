import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import CampaignBase from './CampaignBase'

// Hardcode campaign-specific data requirements here, and remove
// after the campaign is no longer live.
export default createFragmentContainer(CampaignBase, {
  user: graphql`
    fragment CampaignBaseContainer_user on User {
      id
    }
  `
})
