/* eslint-env jest */

const searchPageEnv = process.env.REACT_APP_FEATURE_FLAG_SEARCH_PAGE_ENABLED

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

  test('enableIndexExchangeBidder is false', () => {
    const { enableIndexExchangeBidder } = require('js/utils/feature-flags')
    expect(enableIndexExchangeBidder()).toBe(false)
  })
})
