import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import CampaignBase from './CampaignBase'

export default createFragmentContainer(CampaignBase, {
  user: graphql`
    fragment CampaignBaseContainer_user on User {
      id
    }
  `
})
