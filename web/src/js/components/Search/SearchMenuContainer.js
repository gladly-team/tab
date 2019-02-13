import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import SearchMenu from 'js/components/Search/SearchMenuComponent'

export default createFragmentContainer(SearchMenu, {
  // TODO: remove extraneous data after usin
  // the MoneyRaised component
  app: graphql`
    fragment SearchMenuContainer_app on App {
      moneyRaised
      dollarsPerDayRate
      ...MoneyRaisedContainer_app
    }
  `,
  user: graphql`
    fragment SearchMenuContainer_user on User {
      id
    }
  `,
})
