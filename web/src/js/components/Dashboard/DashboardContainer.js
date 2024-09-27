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
    }
  `,
  user: graphql`
    fragment DashboardContainer_user on User {
      id
      userId
      experimentActions {
        referralNotification
        searchIntro
      }
      notifications {
        code
        variation
      }
      joined
      searches
      tabs
      shopSignupTimestamp
      showSfacExtensionPrompt
      ...WidgetsContainer_user
      ...UserBackgroundImageContainer_user
      ...UserMenuContainer_user
      ...LogTabContainer_user
      ...LogAccountCreationContainer_user
      ...NewUserTourContainer_user
      ...AssignExperimentGroupsContainer_user
    }
  `,
})
