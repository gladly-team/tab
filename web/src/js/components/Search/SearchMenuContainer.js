import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import SearchMenu from 'js/components/Search/SearchMenuComponent'

export default createFragmentContainer(SearchMenu, {
  app: graphql`
    fragment SearchMenuContainer_app on App {
      ...SearchHeartsContainer_app
      ...MoneyRaisedContainer_app
    }
  `,
  user: graphql`
    fragment SearchMenuContainer_user on User {
      id
      searches
      vcDonatedAllTime
      ...SearchHeartsContainer_user
    }
  `,
})
