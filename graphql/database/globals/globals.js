import moment from 'moment'

class Globals {
  constructor () {
    this.raised = 350447.62
    this.raisedUpdateTime = moment('2017-03-20 12:40:11')
    this.dollarsPerDayRate = 400.00
  }
}

/**
 * Get an estimate of how much we've raised, using a combination of
 * the most recent manual entry and the estimated rate of money
 * raised over time.
 * @return {number}  A decimal rounded to two decimal places
 */
function getMoneyRaised () {
  const globals = new Globals()
  const secsInDay = 60 * 60 * 24

  const totalRaised = globals.raised
  const datetimeOfLastEntry = globals.raisedUpdateTime
  const moneyRaisedRate = globals.dollarsPerDayRate
  const now = moment()
  const diff = now.diff(datetimeOfLastEntry, 'seconds')
  const secondsToDays = diff / secsInDay
  const finalRaised = totalRaised + (secondsToDays * moneyRaisedRate)
  return finalRaised.toFixed(2)
}

function getDollarsPerDayRate () {
  const globals = new Globals()
  return globals.dollarsPerDayRate
}

export {
    Globals,
    getMoneyRaised,
    getDollarsPerDayRate
}
