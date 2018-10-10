import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import LogConsentData from 'js/components/Dashboard/LogConsentDataComponent'

export default createFragmentContainer(LogConsentData, {
  user: graphql`
    fragment LogConsentDataContainer_user on User {
      id
    }
  `
})
