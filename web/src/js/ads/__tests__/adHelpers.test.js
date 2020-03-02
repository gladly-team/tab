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

describe('adHelpers: ad IDs', () => {
  test('ad IDs and ad slot IDs are as expected', () => {
    // Important: do not change these IDs without consulting the
    // ad ops team.
    const {
      VERTICAL_AD_UNIT_ID,
      VERTICAL_AD_SLOT_DOM_ID,
      HORIZONTAL_AD_UNIT_ID,
      HORIZONTAL_AD_SLOT_DOM_ID,
    } = require('js/ads/adHelpers')
    expect(VERTICAL_AD_UNIT_ID).toBe('/43865596/HBTR')
    expect(VERTICAL_AD_SLOT_DOM_ID).toBe('div-gpt-ad-1464385742501-0')
    expect(HORIZONTAL_AD_UNIT_ID).toBe('/43865596/HBTL')
    expect(HORIZONTAL_AD_SLOT_DOM_ID).toBe('div-gpt-ad-1464385677836-0')
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
