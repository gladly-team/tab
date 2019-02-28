import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import HeartsDropdown from 'js/components/Dashboard/HeartsDropdownComponent'

export default createFragmentContainer(HeartsDropdown, {
  app: graphql`
    fragment HeartsDropdownContainer_app on App {
      referralVcReward
    }
  `,
  user: graphql`
    fragment HeartsDropdownContainer_user on User {
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
