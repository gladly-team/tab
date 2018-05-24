/* eslint-env jest */

jest.mock('../adsEnabledStatus')
jest.mock('../prebid/prebidConfig')
jest.mock('../prebid/prebidModule')
jest.mock('../amazon/amazonBidder')
jest.mock('utils/client-location')
jest.mock('../consentManagementInit')

beforeEach(() => {
  jest.resetModules()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('ads script', function () {
  it('does not call ads scripts dependencies when ads are not enabled', async () => {
    expect.assertions(2)
    const adsEnabledStatus = require('../adsEnabledStatus').default
    adsEnabledStatus.mockReturnValue(false)
    const prebidConfig = require('../prebid/prebidConfig').default
    const prebidModule = require('../prebid/prebidModule').default
    await require('../ads')
    expect(prebidConfig).not.toHaveBeenCalled()
    expect(prebidModule).not.toHaveBeenCalled()
  })

  it('calls ads scripts dependencies when ads are enabled', async () => {
    expect.assertions(2)
    const adsEnabledStatus = require('../adsEnabledStatus').default
    adsEnabledStatus.mockReturnValue(true)
    const prebidConfig = require('../prebid/prebidConfig').default
    const prebidModule = require('../prebid/prebidModule').default
    await require('../ads')
    expect(prebidConfig).toHaveBeenCalled()
    expect(prebidModule).toHaveBeenCalled()
  })

  it('passes whether the client is in the EU (when true) to ad modules', async () => {
    expect.assertions(2)

    // Mock that the client is in the EU
    const isInEuropeanUnion = require('utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    // Mock that ads are enabled
    const adsEnabledStatus = require('../adsEnabledStatus').default
    adsEnabledStatus.mockReturnValue(true)

    const prebidConfig = require('../prebid/prebidConfig').default
    const amazonBidder = require('../amazon/amazonBidder').default
    await require('../ads')
    expect(prebidConfig).toHaveBeenCalledWith(true)
    expect(amazonBidder).toHaveBeenCalledWith(true)
  })

  it('passes whether the client is in the EU (when false) to ads modules', async () => {
    expect.assertions(2)

    // Mock that the client is not in the EU
    const isInEuropeanUnion = require('utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(false)

    // Mock that ads are enabled
    const adsEnabledStatus = require('../adsEnabledStatus').default
    adsEnabledStatus.mockReturnValue(true)

    const prebidConfig = require('../prebid/prebidConfig').default
    const amazonBidder = require('../amazon/amazonBidder').default
    await require('../ads')
    expect(prebidConfig).toHaveBeenCalledWith(false)
    expect(amazonBidder).toHaveBeenCalledWith(false)
  })

  it('consentManagementInit is called', async () => {
    expect.assertions(1)
    const consentManagementInit = require('../consentManagementInit').default
    await require('../ads')
    expect(consentManagementInit).toHaveBeenCalled()
  })
})
