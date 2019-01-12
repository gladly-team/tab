import graphql from 'babel-plugin-relay/macro'
import {
  createFragmentContainer
} from 'react-relay'

import LogConsentData from 'js/components/Dashboard/LogConsentDataComponent'

export default createFragmentContainer(LogConsentData, {
  user: graphql`
    fragment LogConsentDataContainer_user on User {
      id
    }
  `
})
