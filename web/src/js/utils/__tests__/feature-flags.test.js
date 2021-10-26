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

  test('isGAMDevEnvironment is false if the env var is "false"', () => {
    const isGAMDevEnvironment = require('js/utils/feature-flags')
      .isGAMDevEnvironment
    process.env.REACT_APP_GAM_DEV_ENVIRONMENT = 'false'
    expect(isGAMDevEnvironment()).toBe(false)
  })

  test('isGAMDevEnvironment is true if the env var is "true"', () => {
    const isGAMDevEnvironment = require('js/utils/feature-flags')
      .isGAMDevEnvironment
    process.env.REACT_APP_GAM_DEV_ENVIRONMENT = 'true'
    expect(isGAMDevEnvironment()).toBe(true)
  })

  test('showSwitchCauseWidget is false if the NODE_ENV is development', () => {
    const showSwitchCauseWidget = require('js/utils/feature-flags')
      .showSwitchCauseWidget
    process.env.NODE_ENV = 'development'
    expect(showSwitchCauseWidget()).toBe(true)
  })

  test('isGAMDevEnvironment is true if the NODE_ENV var is production', () => {
    const showSwitchCauseWidget = require('js/utils/feature-flags')
      .showSwitchCauseWidget
    process.env.NODE_ENV = 'production'
    expect(showSwitchCauseWidget()).toBe(false)
  })
})

describe('showVideoAds', () => {
  it('is false if the env var is "false"', () => {
    const showVideoAds = require('js/utils/feature-flags').showVideoAds
    process.env.REACT_APP_ENABLE_VIDEO_ADS = 'false'
    expect(showVideoAds()).toBe(false)
  })

  it('is true if the env var is "true"', () => {
    const showVideoAds = require('js/utils/feature-flags').showVideoAds
    process.env.REACT_APP_ENABLE_VIDEO_ADS = 'true'
    expect(showVideoAds()).toBe(true)
  })

  it('is true if the env var is "false" but the email matches regex', () => {
    const showVideoAds = require('js/utils/feature-flags').showVideoAds
    process.env.REACT_APP_ENABLE_VIDEO_ADS = 'false'
    expect(showVideoAds('blah+truextest123@example.com')).toBe(true)
    expect(showVideoAds('blah+truextest123@foo.com')).toBe(true)
  })

  it('is true if the env var is "false" but the email matches regex with other characters', () => {
    const showVideoAds = require('js/utils/feature-flags').showVideoAds
    process.env.REACT_APP_ENABLE_VIDEO_ADS = 'false'
    expect(showVideoAds('blah.blah1+blah2+truextest123@example.com')).toBe(true)
  })

  it('is true if the env var is "false" but the email matches regex with only numbers', () => {
    const showVideoAds = require('js/utils/feature-flags').showVideoAds
    process.env.REACT_APP_ENABLE_VIDEO_ADS = 'false'
    expect(showVideoAds('123123+truextest123@123.com')).toBe(true)
  })

  it('is false if the env var is "false" and the email does not match regex', () => {
    const showVideoAds = require('js/utils/feature-flags').showVideoAds
    process.env.REACT_APP_ENABLE_VIDEO_ADS = 'false'
    expect(showVideoAds('blah@example.com')).toBe(false)
    expect(showVideoAds('blah+truetest123@example.com')).toBe(false)
    expect(showVideoAds('blah+blah@foo.com')).toBe(false)
  })
})
