import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import Dashboard from './DashboardComponent'

export default createFragmentContainer(Dashboard, {
  user: graphql`
    fragment DashboardContainer_user on User {
      id
      ...WidgetsContainer_user
    }
  `
})
