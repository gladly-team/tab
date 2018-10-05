import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import Dashboard from './DashboardComponent'

export default createFragmentContainer(Dashboard, {
  app: graphql`
    fragment DashboardContainer_app on App {
      isGlobalCampaignLive
      ...MoneyRaisedContainer_app
      ...UserMenuContainer_app
    }
  `,
  user: graphql`
    fragment DashboardContainer_user on User {
      id
      joined
      ...WidgetsContainer_user
      ...UserBackgroundImageContainer_user
      ...UserMenuContainer_user
      ...LogTabContainer_user
      ...LogRevenueContainer_user
      ...LogConsentDataContainer_user
      ...LogAccountCreationContainer_user
      ...CampaignBaseContainer_user
      ...NewUserTourContainer_user
    }
  `
})
