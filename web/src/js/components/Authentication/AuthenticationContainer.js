import graphql from 'babel-plugin-relay/macro'
import {
  createFragmentContainer
} from 'react-relay'

import Authentication from 'js/components/Authentication/Authentication'

export default createFragmentContainer(Authentication, {
  user: graphql`
    fragment AuthenticationContainer_user on User {
      id
      email
      username
      ...AssignExperimentGroupsContainer_user
    }
  `
})
