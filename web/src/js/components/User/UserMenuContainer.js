import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import UserMenu from './UserMenuComponent'

export default createFragmentContainer(UserMenu, {
  user: graphql`
    fragment UserMenuContainer_user on User {
      id
      vcCurrent
      level
      heartsUntilNextLevel 
      vcDonatedAllTime
      numUsersRecruited
    }
  `
})
