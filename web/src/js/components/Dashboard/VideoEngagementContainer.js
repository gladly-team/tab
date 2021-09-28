import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import VideoEngagement from 'js/components/Dashboard/VideoEngagementComponent'

export default createFragmentContainer(VideoEngagement, {
  user: graphql`
    fragment VideoEngagementContainer_user on User {
      id
      truexId
      videoAdEligible
    }
  `,
})
