/* eslint-env jest */

import {
  getPermissionsOverride,
  isValidPermissionsOverride,
  REWARD_REFERRER_OVERRIDE,
} from '../permissions-overrides'

describe('permission overrides', () => {
  test('checker returns true when the override is valid', () => {
    const override = getPermissionsOverride(REWARD_REFERRER_OVERRIDE)
    expect(isValidPermissionsOverride(override)).toBe(true)
  })

  test('checker returns false when the override is invalid', () => {
    const override = 'WRONG-OVERRIDE'
    expect(isValidPermissionsOverride(override)).toBe(false)
  })

  test('getPermissionsOverride returns an override with valid argument', () => {
    const override = getPermissionsOverride(REWARD_REFERRER_OVERRIDE)
    expect(override).toMatch(/REWARD_REFERRER_OVERRIDE_CONFIRMED_[0-9]{5}$/)
  })

  test('getPermissionsOverride returns false with an invalid argument', () => {
    const override = getPermissionsOverride('NOT_A_REAL_OVERRIDE')
    expect(override).toBe(false)
  })
})
