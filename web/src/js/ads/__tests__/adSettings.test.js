/* eslint-env jest */

import moment from 'moment'
import MockDate from 'mockdate'
import { isVariousAdSizesEnabled } from 'js/utils/feature-flags'
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

describe('ad settings', () => {
  test('ad IDs and ad slot IDs are as expected', () => {
    // Important: do not change these IDs without consulting the
    // ad ops team.
    const {
      VERTICAL_AD_UNIT_ID,
      VERTICAL_AD_SLOT_DOM_ID,
      HORIZONTAL_AD_UNIT_ID,
      HORIZONTAL_AD_SLOT_DOM_ID,
    } = require('js/ads/adSettings')
    expect(VERTICAL_AD_UNIT_ID).toBe('/43865596/HBTR')
    expect(VERTICAL_AD_SLOT_DOM_ID).toBe('div-gpt-ad-1464385742501-0')
    expect(HORIZONTAL_AD_UNIT_ID).toBe('/43865596/HBTL')
    expect(HORIZONTAL_AD_SLOT_DOM_ID).toBe('div-gpt-ad-1464385677836-0')
  })

  test('[recently-installed] shows 1 ad', () => {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(23, 'hours')
    )
    const getNumberOfAdsToShow = require('js/ads/adSettings')
      .getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(1)
  })

  test('[unknown-recently-installed] shows 3 ads when the install time is missing', () => {
    getBrowserExtensionInstallTime.mockReturnValue(null)
    const getNumberOfAdsToShow = require('js/ads/adSettings')
      .getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(3)
  })

  test('[no-recently-installed] shouldShowOneAd returns false', () => {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(10, 'days')
    )
    const { shouldShowAdExplanation } = require('js/ads/adSettings')
    expect(shouldShowAdExplanation()).toEqual(false)
  })

  test('[no-recently-installed] shouldShowAdExplanation returns false', () => {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(10, 'days')
    )
    const { shouldShowAdExplanation } = require('js/ads/adSettings')
    expect(shouldShowAdExplanation()).toEqual(false)
  })

  test('[unknown-recently-installed] shouldShowAdExplanation returns false', () => {
    getBrowserExtensionInstallTime.mockReturnValue(null)
    const { shouldShowAdExplanation } = require('js/ads/adSettings')
    expect(shouldShowAdExplanation()).toEqual(false)
  })

  test('[recently-installed] shouldShowAdExplanation returns true', () => {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(12, 'seconds')
    )
    const { shouldShowAdExplanation } = require('js/ads/adSettings')
    expect(shouldShowAdExplanation()).toEqual(true)
  })

  test('[recently-installed] [no-dismissed] shouldShowAdExplanation returns true', () => {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(12, 'seconds')
    )
    hasUserDismissedAdExplanation.mockReturnValue(false)
    const { shouldShowAdExplanation } = require('js/ads/adSettings')
    expect(shouldShowAdExplanation()).toEqual(true)
  })

  test('[recently-installed] [dismissed] shouldShowAdExplanation returns false', () => {
    getBrowserExtensionInstallTime.mockReturnValue(
      moment(mockNow).subtract(12, 'seconds')
    )
    hasUserDismissedAdExplanation.mockReturnValue(true)
    const { shouldShowAdExplanation } = require('js/ads/adSettings')
    expect(shouldShowAdExplanation()).toEqual(false)
  })

  test('getVerticalAdSizes returns the expected ad sizes when various ad sizes are disabled', () => {
    isVariousAdSizesEnabled.mockReturnValue(false)
    const getVerticalAdSizes = require('js/ads/adSettings').getVerticalAdSizes
    expect(getVerticalAdSizes()).toEqual([[300, 250]])
  })

  test('getHorizontalAdSizes returns the expected ad sizes when various ad sizes are disabled', () => {
    isVariousAdSizesEnabled.mockReturnValue(false)
    const getHorizontalAdSizes = require('js/ads/adSettings')
      .getHorizontalAdSizes
    expect(getHorizontalAdSizes()).toEqual([[728, 90]])
  })

  test('getVerticalAdSizes returns the expected ad sizes when various ad sizes are enabled', () => {
    isVariousAdSizesEnabled.mockReturnValue(true)
    const getVerticalAdSizes = require('js/ads/adSettings').getVerticalAdSizes
    expect(getVerticalAdSizes()).toEqual([
      [300, 250],
      [250, 250],
      [160, 600],
      [120, 600],
      [120, 240],
      [240, 400],
      [234, 60],
      [180, 150],
      [125, 125],
      [120, 90],
      [120, 60],
      [120, 30],
      [230, 33],
      [300, 600],
    ])
  })

  test('getHorizontalAdSizes returns the expected ad sizes when various ad sizes are enabled', () => {
    isVariousAdSizesEnabled.mockReturnValue(true)
    const getHorizontalAdSizes = require('js/ads/adSettings')
      .getHorizontalAdSizes
    expect(getHorizontalAdSizes()).toEqual([
      [728, 90],
      [728, 210],
      [720, 300],
      [468, 60],
    ])
  })
})
