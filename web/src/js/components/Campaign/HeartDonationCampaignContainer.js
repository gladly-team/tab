import {
  createFragmentContainer,
  graphql
} from 'react-relay'

import HeartDonationCampaign from 'js/components/Campaign/HeartDonationCampaignComponent'

export default createFragmentContainer(HeartDonationCampaign, {
  app: graphql`
    fragment HeartDonationCampaignContainer_app on App @argumentDefinitions(
      startTime: { type: "String" },
      endTime: { type: "String" },
    ) {
      charity(charityId: $charityId) {
        id
        name
        vcReceived (
          startTime: $startTime,
          endTime: $endTime
        )
        ...DonateHeartsControlsContainer_charity
      }
    }
  `,
  user: graphql`
    fragment HeartDonationCampaignContainer_user on User {
      vcCurrent
      ...DonateHeartsControlsContainer_user
    }
  `
})
