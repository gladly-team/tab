import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import Authentication from './Authentication'

export default createFragmentContainer(Authentication, {
  user: graphql`
    fragment AuthenticationContainer_user on User {
      id
      email
      username
    }
  `
})
