import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import Dashboard from 'js/components/Dashboard/DashboardComponent'

export default createFragmentContainer(Dashboard, {
  app: graphql`
    fragment DashboardContainer_app on App {
      campaign {
        isLive
      }
      ...UserMenuContainer_app
      # @nov-2021-campaign
      ...Nov2021CampaignContainer_app
    }
  `,
  user: graphql`
    fragment DashboardContainer_user on User
      # @nov-2021-campaign
      @argumentDefinitions(
        startTime: { type: "String" }
        endTime: { type: "String" }
      ) {
      id
      experimentActions {
        referralNotification
        searchIntro
      }
      joined
      searches
      tabs
      ...WidgetsContainer_user
      ...UserBackgroundImageContainer_user
      ...UserMenuContainer_user
      ...LogTabContainer_user
      ...LogAccountCreationContainer_user
      ...NewUserTourContainer_user
      ...AssignExperimentGroupsContainer_user
      # @nov-2021-campaign
      ...Nov2021CampaignContainer_user
        @arguments(startTime: $startTime, endTime: $endTime)
    }
  `,
})
