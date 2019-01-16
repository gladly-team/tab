import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import Charity from 'js/components/Donate/CharityComponent'

export default createFragmentContainer(Charity, {
  charity: graphql`
    fragment CharityContainer_charity on Charity {
      id
      description
      logo
      name
      website
      ...DonateHeartsControlsContainer_charity
    }
  `,
  user: graphql`
    fragment CharityContainer_user on User {
      id
      vcCurrent
      ...DonateHeartsControlsContainer_user
    }
  `,
})
