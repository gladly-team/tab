import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useInterval from 'js/utils/hooks/useInterval'
import { currencyFormatted, commaFormatted } from 'js/utils/utils'

const MoneyRaisedGeneric = props => {
  const {
    app: { dollarsPerDayRate, moneyRaised },
  } = props

  const [currentMoneyRaised, setMoneyRaised] = useState(moneyRaised)

  // If the moneyRaised prop changes, use the new value.
  // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
  const [prevMoneyRaised, setPrevMoneyRaised] = useState(moneyRaised)
  if (moneyRaised !== prevMoneyRaised) {
    setMoneyRaised(moneyRaised)
    setPrevMoneyRaised(moneyRaised)
  }

  // Add a penny every X number of seconds.
  const msInDay = 864e5
  const msPerPenny = msInDay / (dollarsPerDayRate * 100)
  useInterval(() => {
    setMoneyRaised(currentMoneyRaised + 0.01)
  }, msPerPenny)

  return <span>${commaFormatted(currencyFormatted(currentMoneyRaised))}</span>
}

MoneyRaisedGeneric.displayName = 'MoneyRaisedGeneric'
MoneyRaisedGeneric.propTypes = {
  app: PropTypes.shape({
    moneyRaised: PropTypes.number.isRequired,
    dollarsPerDayRate: PropTypes.number.isRequired,
  }).isRequired,
}
MoneyRaisedGeneric.defaultProps = {}

export default MoneyRaisedGeneric
