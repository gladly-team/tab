/* eslint-env jest */

import moment from 'moment'
import MockDate from 'mockdate'
import {
  isThirdAdEnabled,
  isVariousAdSizesEnabled
} from 'js/utils/feature-flags'
import {
  EXPERIMENT_AD_EXPLANATION,
  EXPERIMENT_THIRD_AD,
  EXPERIMENT_ONE_AD_FOR_NEW_USERS,
  getUserExperimentGroup
} from 'js/utils/experiments'
import {
  getBrowserExtensionInstallTime,
  hasUserDismissedAdExplanation
} from 'js/utils/local-user-data-mgr'

jest.mock('js/utils/feature-flags')
jest.mock('js/utils/experiments')
jest.mock('js/utils/local-user-data-mgr')

const mockNow = '2017-05-19T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))
  getUserExperimentGroup.mockImplementation(() => 'none')
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
      HORIZONTAL_AD_SLOT_DOM_ID
    } = require('js/ads/adSettings')
    expect(VERTICAL_AD_UNIT_ID).toBe('/43865596/HBTR')
    expect(VERTICAL_AD_SLOT_DOM_ID).toBe('div-gpt-ad-1464385742501-0')
    expect(HORIZONTAL_AD_UNIT_ID).toBe('/43865596/HBTL')
    expect(HORIZONTAL_AD_SLOT_DOM_ID).toBe('div-gpt-ad-1464385677836-0')
  })

  // @experiment-third-ad
  // @experiment-one-ad-for-new-users
  test('[three-ads] [no-one-ad] [recently-installed] shows 2 ads when the "3rd ad" feature is disabled', () => {
    isThirdAdEnabled.mockReturnValue(false)
    getBrowserExtensionInstallTime
      .mockReturnValue(moment(mockNow).subtract(23, 'hours'))
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_THIRD_AD:
          return 'threeAds'
        case EXPERIMENT_ONE_AD_FOR_NEW_USERS:
          return 'default'
        default:
          return 'none'
      }
    })
    const getNumberOfAdsToShow = require('js/ads/adSettings').getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(2)
  })

  test('[no-three-ads] [no-one-ad] [recently-installed] shows 2 ads', () => {
    isThirdAdEnabled.mockReturnValue(true)
    getBrowserExtensionInstallTime
      .mockReturnValue(moment(mockNow).subtract(23, 'hours'))
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_THIRD_AD:
          return 'twoAds'
        case EXPERIMENT_ONE_AD_FOR_NEW_USERS:
          return 'default'
        default:
          return 'none'
      }
    })
    const getNumberOfAdsToShow = require('js/ads/adSettings').getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(2)
  })

  test('[three-ads] [no-one-ad] [recently-installed] shows 3 ads', () => {
    isThirdAdEnabled.mockReturnValue(true)
    getBrowserExtensionInstallTime
      .mockReturnValue(moment(mockNow).subtract(23, 'hours'))
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_THIRD_AD:
          return 'threeAds'
        case EXPERIMENT_ONE_AD_FOR_NEW_USERS:
          return 'default'
        default:
          return 'none'
      }
    })
    const getNumberOfAdsToShow = require('js/ads/adSettings').getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(3)
  })

  test('[no-three-ads] [one-ad] [recently-installed] shows 1 ad', () => {
    isThirdAdEnabled.mockReturnValue(true)
    getBrowserExtensionInstallTime
      .mockReturnValue(moment(mockNow).subtract(23, 'hours'))
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_THIRD_AD:
          return 'twoAds'
        case EXPERIMENT_ONE_AD_FOR_NEW_USERS:
          return 'oneAd'
        default:
          return 'none'
      }
    })
    const getNumberOfAdsToShow = require('js/ads/adSettings').getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(1)
  })

  test('[three-ads] [one-ad] [recently-installed] shows 1 ad', () => {
    isThirdAdEnabled.mockReturnValue(true)
    getBrowserExtensionInstallTime
      .mockReturnValue(moment(mockNow).subtract(23, 'hours'))
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_THIRD_AD:
          return 'threeAds'
        case EXPERIMENT_ONE_AD_FOR_NEW_USERS:
          return 'oneAd'
        default:
          return 'none'
      }
    })
    const getNumberOfAdsToShow = require('js/ads/adSettings').getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(1)
  })

  test('[no-three-ads] [one-ad] [no-recently-installed] shows 2 ads', () => {
    isThirdAdEnabled.mockReturnValue(true)
    getBrowserExtensionInstallTime
      .mockReturnValue(moment(mockNow).subtract(32, 'hours'))
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_THIRD_AD:
          return 'twoAds'
        case EXPERIMENT_ONE_AD_FOR_NEW_USERS:
          return 'oneAd'
        default:
          return 'none'
      }
    })
    const getNumberOfAdsToShow = require('js/ads/adSettings').getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(2)
  })

  test('[no-three-ads] [one-ad] [unknown-recently-installed] shows 2 ads when the install time is missing', () => {
    isThirdAdEnabled.mockReturnValue(true)
    getBrowserExtensionInstallTime.mockReturnValue(null)
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_THIRD_AD:
          return 'twoAds'
        case EXPERIMENT_ONE_AD_FOR_NEW_USERS:
          return 'oneAd'
        default:
          return 'none'
      }
    })
    const getNumberOfAdsToShow = require('js/ads/adSettings').getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(2)
  })

  test('[three-ads] [one-ad] [no-recently-installed] shows 3 ads', () => {
    isThirdAdEnabled.mockReturnValue(true)
    getBrowserExtensionInstallTime
      .mockReturnValue(moment(mockNow).subtract(32, 'hours'))
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_THIRD_AD:
          return 'threeAds'
        case EXPERIMENT_ONE_AD_FOR_NEW_USERS:
          return 'oneAd'
        default:
          return 'none'
      }
    })
    const getNumberOfAdsToShow = require('js/ads/adSettings').getNumberOfAdsToShow
    expect(getNumberOfAdsToShow()).toEqual(3)
  })

  // @experiment-ad-explanation
  test('[no-ad-explanation] [no-recently-installed] shouldShowOneAd returns false', () => {
    getBrowserExtensionInstallTime
      .mockReturnValue(moment(mockNow).subtract(10, 'days'))
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_AD_EXPLANATION:
          return 'default'
        default:
          return 'none'
      }
    })
    const { shouldShowAdExplanation } = require('js/ads/adSettings')
    expect(shouldShowAdExplanation()).toEqual(false)
  })

  test('[no-ad-explanation] [recently-installed] shouldShowOneAd returns false', () => {
    getBrowserExtensionInstallTime
      .mockReturnValue(moment(mockNow).subtract(12, 'seconds'))
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_AD_EXPLANATION:
          return 'default'
        default:
          return 'none'
      }
    })
    const { shouldShowAdExplanation } = require('js/ads/adSettings')
    expect(shouldShowAdExplanation()).toEqual(false)
  })

  test('[ad-explanation] [no-recently-installed] shouldShowOneAd returns false', () => {
    getBrowserExtensionInstallTime
      .mockReturnValue(moment(mockNow).subtract(10, 'days'))
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_AD_EXPLANATION:
          return 'explanation'
        default:
          return 'none'
      }
    })
    const { shouldShowAdExplanation } = require('js/ads/adSettings')
    expect(shouldShowAdExplanation()).toEqual(false)
  })

  test('[ad-explanation] [unknown-recently-installed] shouldShowOneAd returns false', () => {
    getBrowserExtensionInstallTime.mockReturnValue(null)
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_AD_EXPLANATION:
          return 'explanation'
        default:
          return 'none'
      }
    })
    const { shouldShowAdExplanation } = require('js/ads/adSettings')
    expect(shouldShowAdExplanation()).toEqual(false)
  })

  test('[ad-explanation] [recently-installed] shouldShowOneAd returns true', () => {
    getBrowserExtensionInstallTime
      .mockReturnValue(moment(mockNow).subtract(12, 'seconds'))
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_AD_EXPLANATION:
          return 'explanation'
        default:
          return 'none'
      }
    })
    const { shouldShowAdExplanation } = require('js/ads/adSettings')
    expect(shouldShowAdExplanation()).toEqual(true)
  })

  test('[ad-explanation] [recently-installed] [no-dismissed] shouldShowOneAd returns true', () => {
    getBrowserExtensionInstallTime
      .mockReturnValue(moment(mockNow).subtract(12, 'seconds'))
    hasUserDismissedAdExplanation.mockReturnValue(false)
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_AD_EXPLANATION:
          return 'explanation'
        default:
          return 'none'
      }
    })
    const { shouldShowAdExplanation } = require('js/ads/adSettings')
    expect(shouldShowAdExplanation()).toEqual(true)
  })

  test('[ad-explanation] [recently-installed] [dismissed] shouldShowOneAd returns false', () => {
    getBrowserExtensionInstallTime
      .mockReturnValue(moment(mockNow).subtract(12, 'seconds'))
    hasUserDismissedAdExplanation.mockReturnValue(true)
    getUserExperimentGroup.mockImplementation(experimentName => {
      switch (experimentName) {
        case EXPERIMENT_AD_EXPLANATION:
          return 'explanation'
        default:
          return 'none'
      }
    })
    const { shouldShowAdExplanation } = require('js/ads/adSettings')
    expect(shouldShowAdExplanation()).toEqual(false)
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
