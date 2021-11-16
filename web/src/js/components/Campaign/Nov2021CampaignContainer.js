import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'
import Nov2021Campaign from 'js/components/Campaign/Nov2021CampaignComponent'

export default createFragmentContainer(Nov2021Campaign, {
  app: graphql`
    fragment Nov2021CampaignContainer_app on App {
      campaign {
        goal {
          currentNumber
        }
      }
    }
  `,
  user: graphql`
    fragment Nov2021CampaignContainer_user on User
      @argumentDefinitions(
        startTime: { type: "String" }
        endTime: { type: "String" }
      ) {
      recruits(first: 5000, startTime: $startTime, endTime: $endTime) {
        recruitsWithAtLeastOneTab
      }
      ...InviteFriendContainer_user
    }
  `,
})
