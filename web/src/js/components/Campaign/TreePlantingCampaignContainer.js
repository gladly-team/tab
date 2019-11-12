import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import TreePlantingCampaign from 'js/components/Campaign/TreePlantingCampaignComponent'

export default createFragmentContainer(TreePlantingCampaign, {
  app: graphql`
    fragment TreePlantingCampaignContainer_app on App
      @argumentDefinitions(
        startTime: { type: "String" }
        endTime: { type: "String" }
      ) {
      charity(charityId: $charityId) {
        id
        name
        vcReceived(startTime: $startTime, endTime: $endTime)
        ...DonateHeartsControlsContainer_charity
      }
    }
  `,
  user: graphql`
    fragment TreePlantingCampaignContainer_user on User {
      vcCurrent
      ...DonateHeartsControlsContainer_user
    }
  `,
})
