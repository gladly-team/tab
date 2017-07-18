import {
  createFragmentContainer,
  graphql
} from 'react-relay/compat'

import MoneyRaised from './MoneyRaisedComponent'

export default createFragmentContainer(MoneyRaised, {
  app: graphql`
    fragment MoneyRaisedContainer_app on App {
      moneyRaised
      dollarsPerDayRate
    }
  `
})
