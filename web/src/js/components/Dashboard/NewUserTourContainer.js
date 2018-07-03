import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import NewUserTour from './NewUserTourComponent'

export default createFragmentContainer(NewUserTour, {
  user: graphql`
    fragment NewUserTourContainer_user on User {
      ...InviteFriendContainer_user
    }
  `
})
