/* eslint-env jest */

import logger from '../../../utils/logger'

jest.mock('../amazon-cpm-codes.json', () => ({
  'code-1': '0.01',
  'code-2': '0.02',
  'code-3': '0.03',
  'code-4': '0.50',
  'code-5': '7.1',
  'code-6': '20',
  'some-code': 'abc', // invalid
}))
jest.mock('../../../utils/logger')

const nodeEnv = process.env.NODE_ENV

afterEach(() => {
  jest.clearAllMocks()
  process.env.NODE_ENV = nodeEnv // Reset NODE_ENV after tests
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

  it('returns a CPM value of 0.0 when a CPM code is not valid', () => {
    process.env.NODE_ENV = 'development'
    const decodeAmazonCPM = require('../decodeAmazonCPM').default
    const revenueVal = decodeAmazonCPM('oopsWrongCode')
    expect(revenueVal).toBe(0.0)
  })

  it('does not log a warning when a CPM code is not valid', () => {
    const decodeAmazonCPM = require('../decodeAmazonCPM').default
    decodeAmazonCPM('oopsWrongCode')
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it('throws an error when a CPM string resolves to NaN', () => {
    const decodeAmazonCPM = require('../decodeAmazonCPM').default
    expect(() => {
      decodeAmazonCPM('some-code')
    }).toThrow('Amazon CPM code "some-code" resolved to a non-numeric value')
  })
})
