/* eslint-env jest */
import { getMoneyRaised } from '../globals'

describe('Globals Tests', function () {
  it('should return the money raised', () => {
    const moneyRaised = getMoneyRaised()
    expect(moneyRaised > 0).toBe(true)
  })
})
