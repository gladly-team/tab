import {
  createFragmentContainer,
  graphql
} from 'react-relay'

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
