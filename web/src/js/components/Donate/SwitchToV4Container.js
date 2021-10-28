import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import SwitchToCats from 'js/components/Donate/SwitchToV4Component'

export default createFragmentContainer(SwitchToCats, {
  user: graphql`
    fragment SwitchToCatsContainer_user on User {
      id
    }
  `,
})
