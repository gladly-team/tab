import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import LogTab from 'js/components/Dashboard/LogTabComponent'

export default createFragmentContainer(LogTab, {
  user: graphql`
    fragment LogTabContainer_user on User {
      id
    }
  `,
})
