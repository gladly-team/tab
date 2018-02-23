import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import LogAccountCreation from './LogAccountCreationComponent'

export default createFragmentContainer(LogAccountCreation, {
  user: graphql`
    fragment LogAccountCreationContainer_user on User {
      tabs
    }
  `
})
