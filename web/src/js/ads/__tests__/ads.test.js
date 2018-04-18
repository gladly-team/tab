/* eslint-env jest */

jest.mock('../adsEnabledStatus')
jest.mock('../prebid/prebidConfig')
jest.mock('../prebid/prebidModule')

beforeEach(() => {
  jest.resetModules()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('ads script', function () {
  it('does not call ads scripts dependencies when ads are not enabled', () => {
    const adsEnabledStatus = require('../adsEnabledStatus').default
    adsEnabledStatus.mockReturnValue(false)
    const prebidConfig = require('../prebid/prebidConfig').default
    const prebidModule = require('../prebid/prebidModule').default
    require('../ads')
    expect(prebidConfig).not.toHaveBeenCalled()
    expect(prebidModule).not.toHaveBeenCalled()
  })

  it('calls ads scripts dependencies when ads are enabled', () => {
    const adsEnabledStatus = require('../adsEnabledStatus').default
    adsEnabledStatus.mockReturnValue(true)
    const prebidConfig = require('../prebid/prebidConfig').default
    const prebidModule = require('../prebid/prebidModule').default
    require('../ads')
    expect(prebidConfig).toHaveBeenCalled()
    expect(prebidModule).toHaveBeenCalled()
  })
})
