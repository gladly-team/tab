import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import UserMenu from 'js/components/Dashboard/UserMenuComponent'

export default createFragmentContainer(UserMenu, {
  app: graphql`
    fragment UserMenuContainer_app on App {
      ...MoneyRaisedContainer_app
      ...HeartsDropdownContainer_app
    }
  `,
  user: graphql`
    fragment UserMenuContainer_user on User {
      ...HeartsContainer_user
      ...HeartsDropdownContainer_user
      # Remove this after the tree campaign ends.
      recruits(
        first: 5000
        startTime: "2019-11-14T18:00:00.000Z"
        endTime: "2020-01-10T24:00:00.000Z"
      ) {
        recruitsWithAtLeastOneTab
      }
    }
  `,
})
