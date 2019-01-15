import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import SearchPage from 'js/components/Search/SearchPageComponent'

export default createFragmentContainer(SearchPage, {
  app: graphql`
    fragment SearchPageContainer_app on App {
      moneyRaised
      ...MoneyRaisedContainer_app
    }
  `,
  user: graphql`
    fragment SearchPageContainer_user on User {
      id
    }
  `,
})
