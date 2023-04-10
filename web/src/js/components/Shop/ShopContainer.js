import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import ShopComponent from 'js/components/Shop/ShopComponent'

export default createFragmentContainer(ShopComponent, {
  user: graphql`
    fragment ShopContainer_user on User {
      id
      userId
      causeId
      ...SwitchToV4Container_user
    }
  `,
})
