/* eslint-env jest */

import { getUrlParameters } from 'js/utils/utils'

jest.mock('js/utils/utils')

const searchPageEnv = process.env.REACT_APP_FEATURE_FLAG_SEARCH_PAGE_ENABLED

beforeEach(() => {
  getUrlParameters.mockReturnValue({})
})

afterEach(() => {
  // Reset env vars after tests
  process.env.REACT_APP_FEATURE_FLAG_SEARCH_PAGE_ENABLED = searchPageEnv
})

describe('feature flags', () => {
  test('isAnonymousUserSignInEnabled is false', () => {
    const isAnonymousUserSignInEnabled = require('js/utils/feature-flags')
      .isAnonymousUserSignInEnabled
    expect(isAnonymousUserSignInEnabled()).toBe(false)
  })

  test('isVariousAdSizesEnabled is false', () => {
    const isVariousAdSizesEnabled = require('js/utils/feature-flags')
      .isVariousAdSizesEnabled
    expect(isVariousAdSizesEnabled()).toBe(false)
  })

  test('isSearchPageEnabled is false if the env var is "false"', () => {
    const isSearchPageEnabled = require('js/utils/feature-flags')
      .isSearchPageEnabled
    process.env.REACT_APP_FEATURE_FLAG_SEARCH_PAGE_ENABLED = 'false'
    expect(isSearchPageEnabled()).toBe(false)
  })

  test('isSearchPageEnabled is true if the env var is "true"', () => {
    const isSearchPageEnabled = require('js/utils/feature-flags')
      .isSearchPageEnabled
    process.env.REACT_APP_FEATURE_FLAG_SEARCH_PAGE_ENABLED = 'true'
    expect(isSearchPageEnabled()).toBe(true)
  })

  test('showBingJSAds is false if the env var is "false"', () => {
    const showBingJSAds = require('js/utils/feature-flags').showBingJSAds
    process.env.REACT_APP_FEATURE_FLAG_BING_JS_ADS = 'false'
    expect(showBingJSAds()).toBe(false)
  })

  test('showBingJSAds is true if the env var is "true"', () => {
    const showBingJSAds = require('js/utils/feature-flags').showBingJSAds
    process.env.REACT_APP_FEATURE_FLAG_BING_JS_ADS = 'true'
    expect(showBingJSAds()).toBe(true)
  })

  test('isBingJSAdsProductionMode is false if the env var is "false"', () => {
    const isBingJSAdsProductionMode = require('js/utils/feature-flags')
      .isBingJSAdsProductionMode
    process.env.REACT_APP_FEATURE_FLAG_BING_JS_ADS_PRODUCTION_MODE = 'false'
    expect(isBingJSAdsProductionMode()).toBe(false)
  })

  test('isBingJSAdsProductionMode is true if the env var is "true"', () => {
    const isBingJSAdsProductionMode = require('js/utils/feature-flags')
      .isBingJSAdsProductionMode
    process.env.REACT_APP_FEATURE_FLAG_BING_JS_ADS_PRODUCTION_MODE = 'true'
    expect(isBingJSAdsProductionMode()).toBe(true)
  })
})
