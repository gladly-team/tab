/* eslint-env jest */

import {
  validateUsername,
  validateEmail,
  validatePassword
} from '../utils'

describe('username validation', () => {
  it('works for a typical username', () => {
    expect(validateUsername('kevin')).toEqual(true)
  })

  it('allows special characters', () => {
    expect(validateUsername('PequeñoPinguino')).toEqual(true)
  })

  it('allows other special characters', () => {
    expect(validateUsername('äęóń')).toEqual(true)
  })

  it('allows math symbols', () => {
    expect(validateUsername('+*-/')).toEqual(true)
  })

  it('does not allow emoji', () => {
    expect(validateUsername('ISteppedIn💩')).toEqual(false)
  })

  it('does not allow names shorter than two characters', () => {
    expect(validateUsername('a')).toEqual(false)
    expect(validateUsername('ab')).toEqual(true)
  })
})
