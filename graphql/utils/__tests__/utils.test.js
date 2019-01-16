/* eslint-env jest */

describe('utils', () => {
  test('isValidISOString works as expected', () => {
    const { isValidISOString } = require('../utils')
    expect(isValidISOString('abc')).toBe(false)
    expect(isValidISOString('')).toBe(false)
    expect(isValidISOString(0)).toBe(false)
    expect(isValidISOString('abc')).toBe(false)
    // https://stackoverflow.com/questions/22164541/validating-a-iso-8601-date-using-moment-js#comment80286761_40069911
    expect(isValidISOString(1466113)).toBe(false)
    expect(isValidISOString('2017-07-18T20:45:53Z')).toBe(true)
    expect(isValidISOString('2017-07-18T20:45:53')).toBe(true)
    expect(isValidISOString('2017-07-18T20:45:53.012')).toBe(true)
    expect(isValidISOString('2017-07-18T20:45:53.012Z')).toBe(true)
  })
})
