import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedComponent'

export default createFragmentContainer(MoneyRaised, {
  app: graphql`
    fragment MoneyRaisedContainer_app on App {
      moneyRaised
      dollarsPerDayRate
    }
  `,
})
