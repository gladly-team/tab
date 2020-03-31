/* eslint-env jest */

import logger from '../../../utils/logger'

jest.mock('../../../utils/logger')

beforeEach(() => {
  process.env.EST_MONEY_RAISED_PER_TAB = '0.01287'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('globals', () => {
  it('returns the money raised', () => {
    const { getMoneyRaised } = require('../globals')
    expect(getMoneyRaised() > 0).toBe(true)
  })

  it('returns the expected user referral VC reward', () => {
    const { getReferralVcReward } = require('../globals')
    expect(getReferralVcReward()).toBe(350)
  })

  it('returns the estimated money raised per tab [test #1]', () => {
    process.env.EST_MONEY_RAISED_PER_TAB = '0.01287'
    const { getEstimatedMoneyRaisedPerTab } = require('../globals')
    expect(getEstimatedMoneyRaisedPerTab()).toBe(0.01287)
  })

  it('returns the estimated money raised per tab [test #2]', () => {
    process.env.EST_MONEY_RAISED_PER_TAB = '2'
    const { getEstimatedMoneyRaisedPerTab } = require('../globals')
    expect(getEstimatedMoneyRaisedPerTab()).toBe(2.0)
  })

  it('returns 0 for the estimated money raised per tab if process.env.EST_MONEY_RAISED_PER_TAB is undefined', () => {
    process.env.EST_MONEY_RAISED_PER_TAB = undefined
    const { getEstimatedMoneyRaisedPerTab } = require('../globals')
    expect(getEstimatedMoneyRaisedPerTab()).toBe(0.0)
  })

  it('returns 0 for the estimated money raised per tab if process.env.EST_MONEY_RAISED_PER_TAB does not parse into a float', () => {
    process.env.EST_MONEY_RAISED_PER_TAB = 'xyz'
    const { getEstimatedMoneyRaisedPerTab } = require('../globals')
    expect(getEstimatedMoneyRaisedPerTab()).toBe(0.0)
  })

  it('logs an error if we cannot get the estimated money raised from process.env.EST_MONEY_RAISED_PER_TAB', () => {
    process.env.EST_MONEY_RAISED_PER_TAB = undefined
    const { getEstimatedMoneyRaisedPerTab } = require('../globals')
    getEstimatedMoneyRaisedPerTab()
    expect(logger.error).toHaveBeenCalledWith(
      'Could not parse float from money raised env var value undefined'
    )
  })
})
