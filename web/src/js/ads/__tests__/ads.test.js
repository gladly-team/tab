/* eslint-env jest */

const mockAdsEnabledStatus = jest.fn()
const mockPrebidModule = jest.fn()
const mockPrebidConfig = jest.fn()
jest.mock('../adsEnabledStatus', () => mockAdsEnabledStatus)
jest.mock('../prebid/prebidModule', () => mockPrebidModule)
jest.mock('../prebid/prebidConfig', () => mockPrebidConfig)

beforeEach(() => {
  jest.resetModules()
})

describe('ads script', function () {
  it('does not call ads scripts dependencies when ads are not enabled', () => {
    jest.mock('../adsEnabledStatus', () => false)
    require('../ads')
    expect(mockPrebidModule).not.toHaveBeenCalled()
    expect(mockPrebidConfig).not.toHaveBeenCalled()
  })

  it('calls ads scripts dependencies when ads are enabled', () => {
    jest.mock('../adsEnabledStatus', () => true)
    require('../ads')
    expect(mockPrebidModule).toHaveBeenCalled()
    expect(mockPrebidConfig).toHaveBeenCalled()
  })
})
