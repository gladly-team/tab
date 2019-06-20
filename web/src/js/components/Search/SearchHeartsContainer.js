import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import Hearts from 'js/components/Dashboard/HeartsComponent'

export default createFragmentContainer(Hearts, {
  app: graphql`
    fragment SearchHeartsContainer_app on App {
      ...HeartsDropdownContainer_app
    }
  `,
  user: graphql`
    fragment SearchHeartsContainer_user on User {
      vcCurrent
      searchRateLimit {
        limitReached
        reason
      }
      ...HeartsDropdownContainer_user
    }
  `,
})
