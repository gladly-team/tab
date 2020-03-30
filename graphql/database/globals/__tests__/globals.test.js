/* eslint-env jest */

describe('globals', () => {
  it('returns the money raised', () => {
    const { getMoneyRaised } = require('../globals')
    expect(getMoneyRaised() > 0).toBe(true)
  })

  it('returns the expected user referral VC reward', () => {
    const { getReferralVcReward } = require('../globals')
    expect(getReferralVcReward()).toBe(350)
  })

  it('returns the estimated money raised per tab', () => {
    const { getEstimatedMoneyRaisedPerTab } = require('../globals')
    expect(getEstimatedMoneyRaisedPerTab()).toBeGreaterThan(0)
  })
})
