/* eslint-env jest */

jest.mock('../amazon-cpm-codes.json', () => {
  return {
    'code-1': '0.01',
    'code-2': '0.02',
    'code-3': '0.03',
    'code-4': '0.50',
    'code-5': '7.1',
    'code-6': '20'
  }
})

describe('decodeAmazonCPM', () => {
  it('returns expected values', () => {
    const decodeAmazonCPM = require('../decodeAmazonCPM').default
    expect(decodeAmazonCPM('code-1')).toBe(0.01)
    expect(decodeAmazonCPM('code-2')).toBe(0.02)
    expect(decodeAmazonCPM('code-3')).toBe(0.03)
    expect(decodeAmazonCPM('code-4')).toBe(0.5)
    expect(decodeAmazonCPM('code-5')).toBe(7.1)
    expect(decodeAmazonCPM('code-6')).toBe(20)
  })

  it('throws an error when a CPM code is not valid', () => {
    const decodeAmazonCPM = require('../decodeAmazonCPM').default
    expect(() => {
      decodeAmazonCPM('oopsWrongCode')
    }).toThrow()
  })
})
