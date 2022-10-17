/* eslint-env jest */

describe('feature flags', () => {
  test('isGlobalHealthGroupImpactEnabled is false if we are in production', () => {
    process.env.GROWTHBOOK_ENV = 'production'
    const isGlobalHealthGroupImpactEnabled = require('../feature-flags')
      .isGlobalHealthGroupImpactEnabled
    expect(isGlobalHealthGroupImpactEnabled()).toBe(false)
  })

  test('isGlobalHealthGroupImpactEnabled is true if we are in production', () => {
    process.env.GROWTHBOOK_ENV = 'dev'
    const isGlobalHealthGroupImpactEnabled = require('../feature-flags')
      .isGlobalHealthGroupImpactEnabled
    expect(isGlobalHealthGroupImpactEnabled()).toBe(true)
  })
})