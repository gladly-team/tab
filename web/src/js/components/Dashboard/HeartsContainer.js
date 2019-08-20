import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import Hearts from 'js/components/Dashboard/HeartsComponent'

export default createFragmentContainer(Hearts, {
  user: graphql`
    fragment HeartsContainer_user on User {
      vcCurrent
      tabsToday
    }
  `,
})
