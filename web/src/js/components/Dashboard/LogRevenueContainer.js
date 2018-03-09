import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import LogRevenue from './LogRevenueComponent'

export default createFragmentContainer(LogRevenue, {
  user: graphql`
    fragment LogRevenueContainer_user on User {
      id
    }
  `
})
