import moment from 'moment'

import { USER_REFERRAL_VC_REWARD } from '../constants'

class Globals {
  constructor() {
    // When updating these nubmers, also update them:
    // * in the tab-homepage repository
    // * in the search-homepage repository
    this.raised = 678810.0
    this.raisedUpdateTime = moment('2019-01-11T18:02:00.000Z')
    this.dollarsPerDayRate = 450.0
  }
}

function isGlobalCampaignLive() {
  return process.env.IS_GLOBAL_CAMPAIGN_LIVE === 'true' || false
}

/**
 * Get an estimate of how much we've raised, using a combination of
 * the most recent manual entry and the estimated rate of money
 * raised over time.
 * @return {number}  A decimal rounded to two decimal places
 */
function getMoneyRaised() {
  const globals = new Globals()
  const secsInDay = 60 * 60 * 24

  const totalRaised = globals.raised
  const datetimeOfLastEntry = globals.raisedUpdateTime
  const moneyRaisedRate = globals.dollarsPerDayRate
  const now = moment()
  const diff = now.diff(datetimeOfLastEntry, 'seconds')
  const secondsToDays = diff / secsInDay
  const finalRaised = totalRaised + secondsToDays * moneyRaisedRate
  return finalRaised.toFixed(2)
}

function getDollarsPerDayRate() {
  const globals = new Globals()
  return globals.dollarsPerDayRate
}

function getReferralVcReward() {
  return USER_REFERRAL_VC_REWARD
}

export {
  Globals,
  getMoneyRaised,
  getDollarsPerDayRate,
  getReferralVcReward,
  isGlobalCampaignLive,
}
