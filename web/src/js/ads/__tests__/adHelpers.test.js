/* eslint-env jest */

import moment from 'moment'
import MockDate from 'mockdate'
import { getTabsOpenedToday } from 'js/utils/local-user-data-mgr'
import {
  getBrowserExtensionInstallTime,
  hasUserDismissedAdExplanation,
} from 'js/utils/local-user-data-mgr'

jest.mock('js/utils/feature-flags')
jest.mock('js/utils/experiments')
jest.mock('js/utils/local-user-data-mgr')

const mockNow = '2017-05-19T13:59:58.000Z'
var adsEnabledEnv = process.env.REACT_APP_ADS_ENABLED

beforeEach(() => {
  MockDate.set(moment(mockNow))

  // Set a default "tabs opened today" value for tests.
  getTabsOpenedToday.mockReturnValue(2)
})

afterEach(() => {
  MockDate.reset()
  process.env.REACT_APP_ADS_ENABLED = adsEnabledEnv // Reset env var after tests
})

describe('adHelpers: getAdUnits', () => {
  it('returns the expected ad units when all ads are enabled', () => {
    // Set up the conditions for this number of ads.
    process.env.REACT_APP_ADS_ENABLED = 'true' // ads enabled
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(10, 'days') // user installed a while ago
    )
    getTabsOpenedToday.mockReturnValue(2) // user has not opened too many tabs

    const { getAdUnits } = require('js/ads/adHelpers')
    expect(getAdUnits()).toEqual({
      leaderboard: {
        // The long leaderboard ad.
        adId: 'div-gpt-ad-1464385677836-0',
        adUnitId: '/43865596/HBTL',
        sizes: [[728, 90]],
      },
      rectangleAdPrimary: {
        // The primary rectangle ad (bottom-right).
        adId: 'div-gpt-ad-1464385742501-0',
        adUnitId: '/43865596/HBTR',
        sizes: [[300, 250]],
      },
      rectangleAdSecondary: {
        // The second rectangle ad (right side, above the first).
        adId: 'div-gpt-ad-1539903223131-0',
        adUnitId: '/43865596/HBTR2',
        sizes: [[300, 250]],
      },
    })
  })

  it('returns the expected ad units when ads are disabled', () => {
    // Set up the conditions for this number of ads.
    process.env.REACT_APP_ADS_ENABLED = 'false' // ads disabled
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(10, 'days') // user installed a while ago
    )
    getTabsOpenedToday.mockReturnValue(2) // user has not opened too many tabs

    const { getAdUnits } = require('js/ads/adHelpers')
    expect(getAdUnits()).toEqual({})
  })

  it('returns the leaderboard ad unit when one ad is enabled (the user installed recently)', () => {
    // Set up the conditions for this number of ads.
    process.env.REACT_APP_ADS_ENABLED = 'true' // ads enabled
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(23, 'hours') // relatively new user
    )
    getTabsOpenedToday.mockReturnValue(2) // user has not opened too many tabs

    const { getAdUnits } = require('js/ads/adHelpers')
    expect(getAdUnits()).toEqual({
      leaderboard: {
        // The long leaderboard ad.
        adId: 'div-gpt-ad-1464385677836-0',
        adUnitId: '/43865596/HBTL',
        sizes: [[728, 90]],
      },
    })
  })

  it('returns the leaderboard ad unit when one ad is enabled (we do not know if installed recently)', () => {
    // Set up the conditions for this number of ads.
    process.env.REACT_APP_ADS_ENABLED = 'true' // ads enabled
    getBrowserExtensionInstallTime.mockReturnValue(null) // missing data on install time
    getTabsOpenedToday.mockReturnValue(2) // user has not opened too many tabs

    const { getAdUnits } = require('js/ads/adHelpers')
    expect(getAdUnits()).toEqual({
      leaderboard: {
        // The long leaderboard ad.
        adId: 'div-gpt-ad-1464385677836-0',
        adUnitId: '/43865596/HBTL',
        sizes: [[728, 90]],
      },
      rectangleAdPrimary: {
        // The primary rectangle ad (bottom-right).
        adId: 'div-gpt-ad-1464385742501-0',
        adUnitId: '/43865596/HBTR',
        sizes: [[300, 250]],
      },
      rectangleAdSecondary: {
        // The second rectangle ad (right side, above the first).
        adId: 'div-gpt-ad-1539903223131-0',
        adUnitId: '/43865596/HBTR2',
        sizes: [[300, 250]],
      },
    })
  })

  it('returns zero ad units when the user has opened the max tabs with ads today', () => {
    // Set up the conditions for this number of ads.
    process.env.REACT_APP_ADS_ENABLED = 'true' // ads enabled
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(10, 'days') // user installed a while ago
    )
    getTabsOpenedToday.mockReturnValue(212) // exceeded max tabs with ads

    const { getAdUnits } = require('js/ads/adHelpers')
    expect(getAdUnits()).toEqual({})
  })
})

describe('adHelpers: areAdsEnabled', () => {
  it('disables ads when REACT_APP_ADS_ENABLED env var is not set', () => {
    process.env.REACT_APP_ADS_ENABLED = undefined
    const { areAdsEnabled } = require('js/ads/adHelpers')
    expect(areAdsEnabled()).toBe(false)
  })

  it('disables ads when REACT_APP_ADS_ENABLED env var is not "true"', () => {
    process.env.REACT_APP_ADS_ENABLED = 'false'
    const { areAdsEnabled } = require('js/ads/adHelpers')
    expect(areAdsEnabled()).toBe(false)
  })

  it('enables ads when REACT_APP_ADS_ENABLED env var is "true" and the user has not opened any tabs today', () => {
    process.env.REACT_APP_ADS_ENABLED = 'true'
    getTabsOpenedToday.mockReturnValue(0)
    const { areAdsEnabled } = require('js/ads/adHelpers')
    expect(areAdsEnabled()).toBe(true)
  })

  it('enables ads when REACT_APP_ADS_ENABLED env var is "true" and the user has opened below the max number of tabs today', () => {
    process.env.REACT_APP_ADS_ENABLED = 'true'
    getTabsOpenedToday.mockReturnValue(135)
    const { areAdsEnabled } = require('js/ads/adHelpers')
    expect(areAdsEnabled()).toBe(true)
  })

  it('disables ads when the user has opened more than the max number of tabs today', () => {
    process.env.REACT_APP_ADS_ENABLED = 'true'
    getTabsOpenedToday.mockReturnValue(150)
    const { areAdsEnabled } = require('js/ads/adHelpers')
    expect(areAdsEnabled()).toBe(false)
  })
})

describe('adHelpers: showMockAds', () => {
  it('does not show mock ads', () => {
    const { showMockAds } = require('js/ads/adHelpers')
    expect(showMockAds()).toBe(false)
  })
})

describe('adHelpers: shouldShowAdExplanation', () => {
  test('[no-recently-installed] shouldShowAdExplanation returns false', () => {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(10, 'days')
    )
    const { shouldShowAdExplanation } = require('js/ads/adHelpers')
    expect(shouldShowAdExplanation()).toEqual(false)
  })

  test('[no-recently-installed] shouldShowAdExplanation returns false', () => {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(10, 'days')
    )
    const { shouldShowAdExplanation } = require('js/ads/adHelpers')
    expect(shouldShowAdExplanation()).toEqual(false)
  })

  test('[unknown-recently-installed] shouldShowAdExplanation returns false', () => {
    getBrowserExtensionInstallTime.mockReturnValue(null)
    const { shouldShowAdExplanation } = require('js/ads/adHelpers')
    expect(shouldShowAdExplanation()).toEqual(false)
  })

  test('[recently-installed] shouldShowAdExplanation returns true', () => {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(12, 'seconds')
    )
    const { shouldShowAdExplanation } = require('js/ads/adHelpers')
    expect(shouldShowAdExplanation()).toEqual(true)
  })

  test('[recently-installed] [no-dismissed] shouldShowAdExplanation returns true', () => {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(12, 'seconds')
    )
    hasUserDismissedAdExplanation.mockReturnValue(false)
    const { shouldShowAdExplanation } = require('js/ads/adHelpers')
    expect(shouldShowAdExplanation()).toEqual(true)
  })

  test('[recently-installed] [dismissed] shouldShowAdExplanation returns false', () => {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(12, 'seconds')
    )
    hasUserDismissedAdExplanation.mockReturnValue(true)
    const { shouldShowAdExplanation } = require('js/ads/adHelpers')
    expect(shouldShowAdExplanation()).toEqual(false)
  })
})
