import moment from 'moment'
import logger from '../../utils/logger'

import { USER_REFERRAL_VC_REWARD } from '../constants'

// When updating these numbers, also update them:
// * in the tab-homepage repository
// * in the search-homepage repository
const MONEY_RAISED = 1057100.0
const MONEY_RAISED_UPDATE_TIME = moment('2021-01-07T16:30:00.000Z')
const MONEY_RAISED_PER_DAY = 700.0

/**
 * Get an estimate of how much we've raised, using a combination of
 * the most recent manual entry and the estimated rate of money
 * raised over time.
 * @return {String}  A stringified float, rounded to two decimal places
 */
export const getMoneyRaised = () => {
  const secondsInDay = 60 * 60 * 24
  const secondsSinceUpdatedMoneyRaised = moment().diff(
    MONEY_RAISED_UPDATE_TIME,
    'seconds'
  )
  const daysSinceUpdated = secondsSinceUpdatedMoneyRaised / secondsInDay
  const raisedNow = MONEY_RAISED + daysSinceUpdated * MONEY_RAISED_PER_DAY
  return raisedNow.toFixed(2)
}

/**
 * Get an estimate of how much money we raise in any given day.
 * @return {Number}
 */
export const getDollarsPerDayRate = () => MONEY_RAISED_PER_DAY

/**
 * Get the amount of virtual currency a user receives for
 * recruiting a new user.
 * @return {Number}
 */
export const getReferralVcReward = () => USER_REFERRAL_VC_REWARD

/**
 * Get an estimate of how much money is raised by a single valid tab.
 * @return {Number}
 */
export const getEstimatedMoneyRaisedPerTab = () => {
  let moneyRaised = parseFloat(process.env.EST_MONEY_RAISED_PER_TAB)
  if (Number.isNaN(moneyRaised)) {
    moneyRaised = 0.0
    logger.error(
      `Could not parse float from money raised env var value ${
        process.env.EST_MONEY_RAISED_PER_TAB
      }`
    )
  }
  return moneyRaised
}
