import graphql from 'babel-plugin-relay/macro'
import {
  createFragmentContainer
} from 'react-relay'

import StickerCampaign from 'js/components/Campaign/StickerCampaignComponent'

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
