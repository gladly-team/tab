/* eslint-env jest */

var adsEnabledEnv = process.env.ADS_ENABLED

afterEach(() => {
  process.env.ADS_ENABLED = adsEnabledEnv // Reset env var after tests
})

describe('ads enabled status', function () {
  it('disables ads when ADS_ENABLED env var is not set', () => {
    process.env.ADS_ENABLED = undefined
    const adsEnabledStatus = require('../adsEnabledStatus').default
    expect(adsEnabledStatus()).toBe(false)
  })

  it('disables ads when ADS_ENABLED env var is not "true"', () => {
    process.env.ADS_ENABLED = 'false'
    const adsEnabledStatus = require('../adsEnabledStatus').default
    expect(adsEnabledStatus()).toBe(false)
  })

  it('enables ads when ADS_ENABLED env var is "true"', () => {
    process.env.ADS_ENABLED = 'true'
    const adsEnabledStatus = require('../adsEnabledStatus').default
    expect(adsEnabledStatus()).toBe(true)
  })
})
