import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import LogAccountCreation from 'js/components/Dashboard/LogAccountCreationComponent'

export default createFragmentContainer(LogAccountCreation, {
  user: graphql`
    fragment LogAccountCreationContainer_user on User {
      tabs
    }
  `,
})
