import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import ProfileDonateHearts from './ProfileDonateHeartsComponent'

export default createFragmentContainer(ProfileDonateHearts, {
  user: graphql`
    fragment ProfileDonateHeartsContainer_user on User {
      id
    }
  `
})
