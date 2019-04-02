import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import Dashboard from 'js/components/Dashboard/DashboardComponent'

export default createFragmentContainer(Dashboard, {
  app: graphql`
    fragment DashboardContainer_app on App {
      isGlobalCampaignLive
      ...UserMenuContainer_app
    }
  `,
  user: graphql`
    fragment DashboardContainer_user on User {
      id
      experimentActions {
        searchIntro
      }
      joined
      tabs
      ...WidgetsContainer_user
      ...UserBackgroundImageContainer_user
      ...UserMenuContainer_user
      ...LogTabContainer_user
      ...LogRevenueContainer_user
      ...LogConsentDataContainer_user
      ...LogAccountCreationContainer_user
      ...NewUserTourContainer_user
      ...AssignExperimentGroupsContainer_user
    }
  `,
})
