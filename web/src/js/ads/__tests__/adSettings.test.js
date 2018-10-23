/* eslint-env jest */

import {
  isThirdAdEnabled,
  isVariousAdSizesEnabled
} from 'js/utils/feature-flags'
import {
  getUserExperimentGroup
} from 'js/utils/experiments'

jest.mock('js/utils/feature-flags')
jest.mock('js/utils/experiments')

describe('ad settings', () => {
  test('ad IDs and ad slot IDs are as expected', () => {
    // Important: do not change these IDs without consulting the
    // ad ops team.
    const {
      VERTICAL_AD_UNIT_ID,
      VERTICAL_AD_SLOT_DOM_ID,
      HORIZONTAL_AD_UNIT_ID,
      HORIZONTAL_AD_SLOT_DOM_ID
    } = require('js/ads/adSettings')
    expect(VERTICAL_AD_UNIT_ID).toBe('/43865596/HBTR')
    expect(VERTICAL_AD_SLOT_DOM_ID).toBe('div-gpt-ad-1464385742501-0')
    expect(HORIZONTAL_AD_UNIT_ID).toBe('/43865596/HBTL')
    expect(HORIZONTAL_AD_SLOT_DOM_ID).toBe('div-gpt-ad-1464385677836-0')
  })

  test('getNumberOfAdsToShow returns 2 when the "3rd ad" feature is disabled', () => {
    isThirdAdEnabled.mockReturnValue(false)
    const getNumberOfAdsToShow = require('js/ads/adSettings').getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(2)
  })

  test('getNumberOfAdsToShow returns 2 when the "3rd ad" feature is enabled but the user is not in the "3 ad" test group', () => {
    isThirdAdEnabled.mockReturnValue(false)
    getUserExperimentGroup.mockReturnValue('twoAds')
    const getNumberOfAdsToShow = require('js/ads/adSettings').getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(2)
  })

  test('getNumberOfAdsToShow returns 3 when the "3rd ad" feature is enabled and the user is in the "3 ad" test group', () => {
    isThirdAdEnabled.mockReturnValue(true)
    getUserExperimentGroup.mockReturnValue('threeAds')
    const getNumberOfAdsToShow = require('js/ads/adSettings').getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(3)
  })

  test('getVerticalAdSizes returns the expected ad sizes when various ad sizes are disabled', () => {
    isVariousAdSizesEnabled.mockReturnValue(false)
    const getVerticalAdSizes = require('js/ads/adSettings').getVerticalAdSizes
    expect(getVerticalAdSizes()).toEqual(
      [
        [300, 250]
      ]
    )
  })

  test('getHorizontalAdSizes returns the expected ad sizes when various ad sizes are disabled', () => {
    isVariousAdSizesEnabled.mockReturnValue(false)
    const getHorizontalAdSizes = require('js/ads/adSettings').getHorizontalAdSizes
    expect(getHorizontalAdSizes()).toEqual(
      [
        [728, 90]
      ]
    )
  })

  test('getVerticalAdSizes returns the expected ad sizes when various ad sizes are enabled', () => {
    isVariousAdSizesEnabled.mockReturnValue(true)
    const getVerticalAdSizes = require('js/ads/adSettings').getVerticalAdSizes
    expect(getVerticalAdSizes()).toEqual(
      [
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
        [300, 600]
      ]
    )
  })

  test('getHorizontalAdSizes returns the expected ad sizes when various ad sizes are enabled', () => {
    isVariousAdSizesEnabled.mockReturnValue(true)
    const getHorizontalAdSizes = require('js/ads/adSettings').getHorizontalAdSizes
    expect(getHorizontalAdSizes()).toEqual(
      [
        [728, 90],
        [728, 210],
        [720, 300],
        [468, 60]
      ]
    )
  })
})
