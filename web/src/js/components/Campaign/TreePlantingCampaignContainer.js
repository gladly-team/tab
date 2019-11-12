import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import TreePlantingCampaign from 'js/components/Campaign/TreePlantingCampaignComponent'

export default createFragmentContainer(TreePlantingCampaign, {
  app: graphql`
    fragment TreePlantingCampaignContainer_app on App {
      campaign {
        numNewUsers
      }
    }
  `,
  user: graphql`
    fragment TreePlantingCampaignContainer_user on User
      @argumentDefinitions(
        startTime: { type: "String" }
        endTime: { type: "String" }
      ) {
      recruits(first: 5000, startTime: $startTime, endTime: $endTime) {
        totalRecruits
        recruitsActiveForAtLeastOneDay
        recruitsWithAtLeastOneTab
      }
      ...InviteFriendContainer_user
    }
  `,
})
