/* eslint-env jest */

const mockGoogleDisplayAd = jest.fn()
const mockMockDisplayAd = jest.fn()
jest.mock('../google/googleDisplayAd', () => mockGoogleDisplayAd)
jest.mock('../mockDisplayAd', () => mockMockDisplayAd)

beforeEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('displayAd', function () {
  it('calls mockDisplayAd when ads are not enabled', () => {
    jest.mock('../adsEnabledStatus', () => false)
    const displayAd = require('../displayAd').default
    displayAd('my-ad')
    expect(mockGoogleDisplayAd).not.toHaveBeenCalled()
    expect(mockMockDisplayAd).toHaveBeenCalledWith('my-ad')
  })

  it('calls googleDisplayAd when ads are enabled', () => {
    jest.mock('../adsEnabledStatus', () => true)
    const displayAd = require('../displayAd').default
    displayAd('some-ad')
    expect(mockGoogleDisplayAd).toHaveBeenCalledWith('some-ad')
    expect(mockMockDisplayAd).not.toHaveBeenCalled()
  })
})
