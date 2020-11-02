import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'
import MillionRaisedCampaign from 'js/components/Campaign/MillionRaisedCampaign'

export default createFragmentContainer(MillionRaisedCampaign, {
  app: graphql`
    fragment MillionRaisedCampaignContainer_app on App {
      moneyRaised
      dollarsPerDayRate
    }
  `,
  user: graphql`
    fragment MillionRaisedCampaignContainer_user on User {
      id
      username
    }
  `,
})
