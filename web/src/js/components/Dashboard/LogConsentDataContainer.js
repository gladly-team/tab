import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import LogConsentData from './LogConsentDataComponent'

export default createFragmentContainer(LogConsentData, {
  user: graphql`
    fragment LogConsentDataContainer_user on User {
      id
    }
  `
})
