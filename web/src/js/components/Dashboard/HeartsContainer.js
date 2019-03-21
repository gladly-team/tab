import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import Hearts from 'js/components/Dashboard/HeartsComponent'

export default createFragmentContainer(Hearts, {
  app: graphql`
    fragment HeartsContainer_app on App {
      ...HeartsDropdownContainer_app
    }
  `,
  user: graphql`
    fragment HeartsContainer_user on User {
      vcCurrent
      searchesToday
      tabsToday
      ...HeartsDropdownContainer_user
    }
  `,
})
