import graphql from 'babel-plugin-relay/macro'
import {
  createFragmentContainer
} from 'react-relay'

import ProfileStats from 'js/components/Settings/Profile/ProfileStatsComponent'

export default createFragmentContainer(ProfileStats, {
  user: graphql`
    fragment ProfileStatsContainer_user on User {
      id
      username
      heartsUntilNextLevel
      joined
      level
      maxTabsDay {
        date
        numTabs
      }
      numUsersRecruited
      tabs
      vcDonatedAllTime
    }
  `
})
