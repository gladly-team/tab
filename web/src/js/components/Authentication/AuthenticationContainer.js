import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import Authentication from 'js/components/Authentication/Authentication'

// TODO: fetch if the user is in the Tab v4 beta
export default createFragmentContainer(Authentication, {
  user: graphql`
    fragment AuthenticationContainer_user on User {
      id
      email
      username
      ...AssignExperimentGroupsContainer_user
    }
  `,
})
