import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import UserMenu from 'js/components/User/UserMenuComponent'

export default createFragmentContainer(UserMenu, {
  app: graphql`
    fragment UserMenuContainer_app on App {
      referralVcReward
    }
  `,
  user: graphql`
    fragment UserMenuContainer_user on User {
      id
      vcCurrent
      level
      heartsUntilNextLevel
      vcDonatedAllTime
      numUsersRecruited
      tabsToday
    }
  `,
})
