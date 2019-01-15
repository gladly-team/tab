/* eslint-env jest */
import { getMoneyRaised, getReferralVcReward } from '../globals'

describe('Globals Tests', function() {
  it('should return the money raised', () => {
    const moneyRaised = getMoneyRaised()
    expect(moneyRaised > 0).toBe(true)
  })

  it('returns the expected user referral VC reward', () => {
    expect(getReferralVcReward()).toBe(350)
  })
})
