import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import LogRevenue from 'js/components/Dashboard/LogRevenueComponent'

export default createFragmentContainer(LogRevenue, {
  user: graphql`
    fragment LogRevenueContainer_user on User {
      id
    }
  `
})
