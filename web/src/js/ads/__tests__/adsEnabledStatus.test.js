/* eslint-env jest */

import { getTabsOpenedToday } from 'js/utils/local-user-data-mgr'

jest.mock('js/utils/local-user-data-mgr')

var adsEnabledEnv = process.env.REACT_APP_ADS_ENABLED

afterEach(() => {
  process.env.REACT_APP_ADS_ENABLED = adsEnabledEnv // Reset env var after tests
})

describe('ads enabled status', function () {
  it('disables ads when REACT_APP_ADS_ENABLED env var is not set', () => {
    process.env.REACT_APP_ADS_ENABLED = undefined
    const adsEnabledStatus = require('js/ads/adsEnabledStatus').default
    expect(adsEnabledStatus()).toBe(false)
  })

  it('disables ads when REACT_APP_ADS_ENABLED env var is not "true"', () => {
    process.env.REACT_APP_ADS_ENABLED = 'false'
    const adsEnabledStatus = require('js/ads/adsEnabledStatus').default
    expect(adsEnabledStatus()).toBe(false)
  })

  it('enables ads when REACT_APP_ADS_ENABLED env var is "true" and the user has not opened any tabs today', () => {
    process.env.REACT_APP_ADS_ENABLED = 'true'
    getTabsOpenedToday.mockReturnValue(0)
    const adsEnabledStatus = require('js/ads/adsEnabledStatus').default
    expect(adsEnabledStatus()).toBe(true)
  })

  it('enables ads when REACT_APP_ADS_ENABLED env var is "true" and the user has opened below the max number of tabs today', () => {
    process.env.REACT_APP_ADS_ENABLED = 'true'
    getTabsOpenedToday.mockReturnValue(135)
    const adsEnabledStatus = require('js/ads/adsEnabledStatus').default
    expect(adsEnabledStatus()).toBe(true)
  })

  it('disables ads when the user has opened more than the max number of tabs today', () => {
    process.env.REACT_APP_ADS_ENABLED = 'true'
    getTabsOpenedToday.mockReturnValue(150)
    const adsEnabledStatus = require('js/ads/adsEnabledStatus').default
    expect(adsEnabledStatus()).toBe(false)
  })
})
