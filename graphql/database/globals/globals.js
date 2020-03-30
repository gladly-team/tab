import moment from 'moment'

import { USER_REFERRAL_VC_REWARD } from '../constants'

// When updating these numbers, also update them:
// * in the tab-homepage repository
// * in the search-homepage repository
const MONEY_RAISED = 678810.0
const MONEY_RAISED_UPDATE_TIME = moment('2019-01-11T18:02:00.000Z')
const MONEY_RAISED_PER_DAY = 450.0

/**
 * Get an estimate of how much we've raised, using a combination of
 * the most recent manual entry and the estimated rate of money
 * raised over time.
 * @return {number}  A decimal rounded to two decimal places
 */
export const getMoneyRaised = () => {
  const daysSinceUpdatedMoneyRaised = moment().diff(
    MONEY_RAISED_UPDATE_TIME,
    'days'
  )
  const raisedNow =
    MONEY_RAISED + daysSinceUpdatedMoneyRaised * MONEY_RAISED_PER_DAY
  return raisedNow.toFixed(2)
}

export const getDollarsPerDayRate = () => MONEY_RAISED_PER_DAY

export const getReferralVcReward = () => USER_REFERRAL_VC_REWARD

export const getEstimatedMoneyRaisedPerTab = () => {
  // TODO: env var
  return 0.01
}
