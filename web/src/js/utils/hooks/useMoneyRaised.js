import { useState } from 'react'
import useInterval from 'js/utils/hooks/useInterval'
import { currencyFormatted, commaFormatted } from 'js/utils/utils'

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useMoneyRaised({ moneyRaised, dollarsPerDayRate }) {
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

  return {
    moneyRaised: currentMoneyRaised,
    moneyRaisedUSDString: `$${commaFormatted(
      currencyFormatted(currentMoneyRaised)
    )}`,
  }
}

export default useMoneyRaised
