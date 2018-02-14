import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import StickerCampaign from './StickerCampaignComponent'

export default createFragmentContainer(StickerCampaign, {
  user: graphql`
    fragment StickerCampaignContainer_user on User {
      username,
      recruits (first: 5000, startTime: "2018-02-13T23:00:00.000Z", endTime: "2018-02-23T20:00:00.000Z") {
        totalRecruits,
        recruitsActiveForAtLeastOneDay
      }
    }
  `
})
