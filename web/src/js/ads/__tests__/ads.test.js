/* eslint-env jest */
import {
  getDefaultTabGlobal
} from 'utils/test-utils'
import getGoogleTag, {
  __setPubadsRefreshMock
} from '../google/getGoogleTag'
import getAmazonTag from '../amazon/getAmazonTag'
import getPrebidPbjs from '../prebid/getPrebidPbjs'
import prebidConfig from '../prebid/prebidConfig'

jest.mock('../google/getGoogleTag')
jest.mock('../amazon/getAmazonTag')
jest.mock('../prebid/getPrebidPbjs')
jest.mock('../prebid/prebidConfig')
jest.mock('../amazon/amazonBidder')
jest.mock('utils/client-location')
jest.mock('../handleAdsLoaded')
jest.mock('../adsEnabledStatus')

beforeAll(() => {
  jest.useFakeTimers()
})

beforeEach(() => {
  // Enable ads by default.
  const adsEnabledStatus = require('../adsEnabledStatus').default
  adsEnabledStatus.mockReturnValue(true)

  // Mock apstag
  delete window.apstag
  window.apstag = getAmazonTag()

  // Mock Prebid global
  delete window.pbjs
  window.pbjs = getPrebidPbjs()

  // Mock tabforacause global
  window.tabforacause = getDefaultTabGlobal()

  // Set up googletag
  delete window.googletag
  window.googletag = getGoogleTag()
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

afterAll(() => {
  delete window.googletag
  delete window.apstag
  delete window.pbjs
  delete window.tabforacause
})

describe('ads script', () => {
  it('calls the expected bidders and ad server', async () => {
    expect.assertions(3)
    const amazonBidder = require('../amazon/amazonBidder').default
    const googletagMockRefresh = jest.fn()
    __setPubadsRefreshMock(googletagMockRefresh)

    require('../ads')

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(amazonBidder).toHaveBeenCalledTimes(1)
    expect(prebidConfig).toHaveBeenCalledTimes(1)
    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)
  })

  it('does not call expected bidders or ad server when ads are not enabled', async () => {
    expect.assertions(3)
    const amazonBidder = require('../amazon/amazonBidder').default

    // Disable ads.
    const adsEnabledStatus = require('../adsEnabledStatus').default
    adsEnabledStatus.mockReturnValue(false)

    const googletagMockRefresh = jest.fn()
    __setPubadsRefreshMock(googletagMockRefresh)

    require('../ads')

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(amazonBidder).not.toHaveBeenCalled()
    expect(prebidConfig).not.toHaveBeenCalled()
    expect(googletagMockRefresh).not.toHaveBeenCalled()
  })

  it('sets ad server targeting before calling the ad server', async () => {
    expect.assertions(3)
    const googletagMockRefresh = jest.fn()
    __setPubadsRefreshMock(googletagMockRefresh)

    require('../ads')
    await new Promise(resolve => setImmediate(resolve))

    expect(window.pbjs.setTargetingForGPTAsync).toHaveBeenCalledTimes(1)
    expect(window.pbjs.setTargetingForGPTAsync).toHaveBeenCalledTimes(1)
    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)
  })

  it('calls the ad server even when all bidders time out', async () => {
    expect.assertions(2)

    // Mock that Prebid is very slow to respond
    const prebidConfig = require('../prebid/prebidConfig').default
    prebidConfig.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 15e3)
      })
    })

    // Mock that Amazon is very slow to respond
    const amazonBidder = require('../amazon/amazonBidder').default
    amazonBidder.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 15e3)
      })
    })

    const googletagMockRefresh = jest.fn()
    __setPubadsRefreshMock(googletagMockRefresh)

    require('../ads')
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).not.toHaveBeenCalled()

    jest.advanceTimersByTime(3e3)
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)
  })

  it('calls the ad server when one bidder times out', async () => {
    expect.assertions(2)

    // Mock that Prebid is very slow to respond
    const prebidConfig = require('../prebid/prebidConfig').default
    prebidConfig.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 15e3)
      })
    })

    // Mock that Amazon responds quickly
    const amazonBidder = require('../amazon/amazonBidder').default
    amazonBidder.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 80)
      })
    })

    const googletagMockRefresh = jest.fn()
    __setPubadsRefreshMock(googletagMockRefresh)

    require('../ads')
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).not.toHaveBeenCalled()
    jest.advanceTimersByTime(3e3)
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)
  })

  it('calls the ad server immediately when all bidders respond before the timeout', async () => {
    expect.assertions(1)

    // Mock that Prebid responds quickly
    const prebidConfig = require('../prebid/prebidConfig').default
    prebidConfig.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 40)
      })
    })

    // Mock that Amazon responds quickly
    const amazonBidder = require('../amazon/amazonBidder').default
    amazonBidder.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 40)
      })
    })

    const googletagMockRefresh = jest.fn()
    __setPubadsRefreshMock(googletagMockRefresh)

    require('../ads')
    jest.advanceTimersByTime(41)
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)
  })

  it('only calls the ad server once when all bidders respond before the timeout', async () => {
    expect.assertions(2)

    // Mock that Prebid responds quickly
    const prebidConfig = require('../prebid/prebidConfig').default
    prebidConfig.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 40)
      })
    })

    // Mock that Amazon responds quickly
    const amazonBidder = require('../amazon/amazonBidder').default
    amazonBidder.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 40)
      })
    })

    const googletagMockRefresh = jest.fn()
    __setPubadsRefreshMock(googletagMockRefresh)

    require('../ads')
    jest.advanceTimersByTime(41)
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(20e3)
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)
  })

  it('calls to store Amazon bids on the window for analytics (if Amazon is included in the auction)', async () => {
    expect.assertions(1)
    const storeAmazonBids = require('../amazon/amazonBidder').storeAmazonBids

    // Mock that Amazon responds quickly
    const amazonBidder = require('../amazon/amazonBidder').default
    amazonBidder.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 80)
      })
    })

    require('../ads')
    jest.advanceTimersByTime(100)
    await new Promise(resolve => setImmediate(resolve))
    expect(storeAmazonBids).toHaveBeenCalledTimes(1)
  })

  it('does not call to store Amazon bids on the window for analytics (if Amazon is not included in the auction)', async () => {
    expect.assertions(1)
    const storeAmazonBids = require('../amazon/amazonBidder').storeAmazonBids

    // Mock that Amazon responds slowly
    const amazonBidder = require('../amazon/amazonBidder').default
    amazonBidder.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 15e3)
      })
    })

    require('../ads')
    jest.advanceTimersByTime(3e3)
    await new Promise(resolve => setImmediate(resolve))
    expect(storeAmazonBids).not.toHaveBeenCalled()
  })

  it('calls handleAdsLoaded', async () => {
    expect.assertions(1)
    const handleAdsLoaded = require('../handleAdsLoaded').default
    require('../ads')
    expect(handleAdsLoaded).toHaveBeenCalledTimes(1)
  })
})
