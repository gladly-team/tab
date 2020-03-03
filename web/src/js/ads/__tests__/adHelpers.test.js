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

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  MockDate.reset()
})

var adsEnabledEnv = process.env.REACT_APP_ADS_ENABLED

afterEach(() => {
  process.env.REACT_APP_ADS_ENABLED = adsEnabledEnv // Reset env var after tests
})

describe('adHelpers: getAdUnits', () => {
  it('returns the expected ad units when all ads are enabled', () => {
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

describe('adHelpers: getNumberOfAdsToShow', () => {
  test('[recently-installed] shows 1 ad', () => {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(23, 'hours')
    )
    const getNumberOfAdsToShow = require('js/ads/adHelpers')
      .getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(1)
  })

  test('[no-recently-installed] shows 3 ads', () => {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(10, 'days')
    )
    const getNumberOfAdsToShow = require('js/ads/adHelpers')
      .getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(3)
  })

  test('[unknown-recently-installed] shows 3 ads when the install time is missing', () => {
    getBrowserExtensionInstallTime.mockReturnValue(null)
    const getNumberOfAdsToShow = require('js/ads/adHelpers')
      .getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(3)
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
