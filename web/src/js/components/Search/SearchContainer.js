import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import SearchPage from 'js/components/Search/SearchPageComponent'

export default createFragmentContainer(SearchPage, {
  app: graphql`
    fragment SearchContainer_app on App {
      ...MoneyRaisedContainer_app
    }
  `,
  user: graphql`
    fragment SearchContainer_user on User {
      id
    }
  `
})
