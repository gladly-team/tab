import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import UserMenu from 'js/components/Dashboard/UserMenuComponent'

export default createFragmentContainer(UserMenu, {
  app: graphql`
    fragment UserMenuContainer_app on App {
      ...MoneyRaisedContainer_app
      ...HeartsContainer_app
    }
  `,
  user: graphql`
    fragment UserMenuContainer_user on User {
      ...HeartsContainer_user
    }
  `,
})
