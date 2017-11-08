import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import ProfileInviteFriend from './ProfileInviteFriendComponent'

export default createFragmentContainer(ProfileInviteFriend, {
  user: graphql`
    fragment ProfileInviteFriendContainer_user on User {
      numUsersRecruited
      username
    }
  `
})
