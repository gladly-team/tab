import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import NewUserTour from 'js/components/Dashboard/NewUserTourComponent'

// If this needs to fetch substantially more data
// than we currently do on the new tab page, we
// may want to give it its own QueryRenderer so
// that we don't fetch unneeded data on every tab.
export default createFragmentContainer(NewUserTour, {
  user: graphql`
    fragment NewUserTourContainer_user on User {
      ...InviteFriendContainer_user
    }
  `,
})
