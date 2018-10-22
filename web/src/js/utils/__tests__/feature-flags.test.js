/* eslint-env jest */

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

  test('isThirdAdEnabled is false', () => {
    const isThirdAdEnabled = require('js/utils/feature-flags')
      .isThirdAdEnabled
    expect(isThirdAdEnabled()).toBe(false)
  })
})
