import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import LogAccountCreation from './LogAccountCreationComponent'

export default createFragmentContainer(LogAccountCreation, {
  user: graphql`
    fragment LogAccountCreationContainer_user on User {
      tabs
    }
  `
})
