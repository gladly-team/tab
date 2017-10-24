import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import ProfileStats from './ProfileStatsComponent'

export default createFragmentContainer(ProfileStats, {
  user: graphql`
    fragment ProfileStatsContainer_user on User {
      id
      joined
    }
  `
})
