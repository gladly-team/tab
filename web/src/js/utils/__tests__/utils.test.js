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

describe('email validation', () => {
  it('works for a typical email', () => {
    expect(validateEmail('foo@bar.com')).toEqual(true)
  })

  it('allows special characters', () => {
    expect(validateEmail('pequeño.pinguino@gmail.com')).toEqual(true)
  })

  it('allows plus sign', () => {
    expect(validateEmail('foo+stuff@bar.com')).toEqual(true)
  })

  it('fails with invalid TLD', () => {
    expect(validateEmail('foo@blah')).toEqual(false)
  })

  it('fails with invalid @@ signs', () => {
    expect(validateEmail('foo@@blah.com')).toEqual(false)
  })

  it('fails with lack of @ sign', () => {
    expect(validateEmail('fooblah.com')).toEqual(false)
  })
})

const passwordConfig = {
  lowercase: false,
  uppercase: false,
  numeric: false,
  special: false,
  minSize: 8
}
describe('password validation', () => {
  it('works for a typical password', () => {
    expect(validatePassword('abC123$@abv', passwordConfig).valid).toEqual(true)
  })

  it('does not require special characters or caps', () => {
    expect(validatePassword('abcabcabc', passwordConfig).valid).toEqual(true)
  })

  it('fails when shorter than 8 characters', () => {
    expect(validatePassword('1234567', passwordConfig).valid).toEqual(false)
  })
})
