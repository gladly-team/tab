/* eslint-env jest */

const anonUserSignInEnv = process.env.FEATURE_FLAG_ANON_USER_SIGN_IN

afterEach(() => {
  // Reset env vars after tests
  process.env.FEATURE_FLAG_ANON_USER_SIGN_IN = anonUserSignInEnv
})

describe('feature flags', () => {
  test('isAnonymousUserSignInEnabled is false if the env var is "false"', () => {
    const isAnonymousUserSignInEnabled = require('../feature-flags')
      .isAnonymousUserSignInEnabled
    process.env.FEATURE_FLAG_ANON_USER_SIGN_IN = 'false'
    expect(isAnonymousUserSignInEnabled()).toBe(false)
  })

  test('isAnonymousUserSignInEnabled is true if the env var is "true"', () => {
    const isAnonymousUserSignInEnabled = require('../feature-flags')
      .isAnonymousUserSignInEnabled
    process.env.FEATURE_FLAG_ANON_USER_SIGN_IN = 'true'
    expect(isAnonymousUserSignInEnabled()).toBe(true)
  })

  test('isAnonymousUserSignInEnabled is false if the env var is a string other than "true"', () => {
    const isAnonymousUserSignInEnabled = require('../feature-flags')
      .isAnonymousUserSignInEnabled
    process.env.FEATURE_FLAG_ANON_USER_SIGN_IN = 'yes'
    expect(isAnonymousUserSignInEnabled()).toBe(false)
  })
})
