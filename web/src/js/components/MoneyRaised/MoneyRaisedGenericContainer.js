import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import MoneyRaisedGeneric from 'js/components/MoneyRaised/MoneyRaisedGeneric'

export default createFragmentContainer(MoneyRaisedGeneric, {
  app: graphql`
    fragment MoneyRaisedGenericContainer_app on App {
      moneyRaised
      dollarsPerDayRate
    }
  `,
})
