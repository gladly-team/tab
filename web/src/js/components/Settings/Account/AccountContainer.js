import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import Account from './AccountComponent'

export default createFragmentContainer(Account, {
  user: graphql`
    fragment AccountContainer_user on User {
      id
      email
      username
      ...LogConsentDataContainer_user
    }
  `
})
