import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import StickerCampaign from './StickerCampaignComponent'

// TODO: add campaign startTime and endTime filters for recruits
export default createFragmentContainer(StickerCampaign, {
  user: graphql`
    fragment StickerCampaignContainer_user on User {
      username,
      recruits {
        edges {
          node {
            recruitedAt
          }
        },
        totalRecruits,
        recruitsActiveForAtLeastOneDay
      }
    }
  `
})
