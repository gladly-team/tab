/* eslint-env jest */
import {
  getDefaultTabGlobal
} from 'js/utils/test-utils'
import getGoogleTag, {
  __setPubadsRefreshMock
} from 'js/ads/google/getGoogleTag'
import getAmazonTag from 'js/ads/amazon/getAmazonTag'
import getPrebidPbjs from 'js/ads/prebid/getPrebidPbjs'

jest.mock('js/ads/prebid/prebid')
jest.mock('js/ads/google/getGoogleTag')
jest.mock('js/ads/amazon/getAmazonTag')
jest.mock('js/ads/prebid/getPrebidPbjs')
jest.mock('js/ads/prebid/prebidConfig')
jest.mock('js/ads/amazon/amazonBidder')
jest.mock('js/utils/client-location')
jest.mock('js/ads/handleAdsLoaded')
jest.mock('js/ads/adsEnabledStatus')
jest.mock('js/ads/google/setUpGoogleAds')

beforeAll(() => {
  jest.useFakeTimers()
})

beforeEach(() => {
  // Enable ads by default.
  const adsEnabledStatus = require('js/ads/adsEnabledStatus').default
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
  it('sets up the Google ad slots', async () => {
    expect.assertions(1)
    const setUpGoogleAds = require('js/ads/google/setUpGoogleAds').default
    require('js/ads/ads')
    expect(setUpGoogleAds).toHaveBeenCalledTimes(1)
  })

  it('calls the expected bidders and ad server', async () => {
    expect.assertions(3)
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    const prebidConfig = require('js/ads/prebid/prebidConfig').default
    const googletagMockRefresh = jest.fn()
    __setPubadsRefreshMock(googletagMockRefresh)

    require('js/ads/ads')

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(amazonBidder).toHaveBeenCalledTimes(1)
    expect(prebidConfig).toHaveBeenCalledTimes(1)
    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)
  })

  it('does not call expected bidders or ad server when ads are not enabled', async () => {
    expect.assertions(3)
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    const prebidConfig = require('js/ads/prebid/prebidConfig').default

    // Disable ads.
    const adsEnabledStatus = require('js/ads/adsEnabledStatus').default
    adsEnabledStatus.mockReturnValue(false)

    const googletagMockRefresh = jest.fn()
    __setPubadsRefreshMock(googletagMockRefresh)

    require('js/ads/ads')

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

    require('js/ads/ads')
    await new Promise(resolve => setImmediate(resolve))

    expect(window.pbjs.setTargetingForGPTAsync).toHaveBeenCalledTimes(1)
    expect(window.pbjs.setTargetingForGPTAsync).toHaveBeenCalledTimes(1)
    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)
  })

  it('calls the ad server even when all bidders time out', async () => {
    expect.assertions(2)

    // Mock that Prebid is very slow to respond
    const prebidConfig = require('js/ads/prebid/prebidConfig').default
    prebidConfig.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 15e3)
      })
    })

    // Mock that Amazon is very slow to respond
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    amazonBidder.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 15e3)
      })
    })

    const googletagMockRefresh = jest.fn()
    __setPubadsRefreshMock(googletagMockRefresh)

    require('js/ads/ads')
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).not.toHaveBeenCalled()

    jest.advanceTimersByTime(3e3)
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)
  })

  it('calls the ad server when one bidder times out', async () => {
    expect.assertions(2)

    // Mock that Prebid is very slow to respond
    const prebidConfig = require('js/ads/prebid/prebidConfig').default
    prebidConfig.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 15e3)
      })
    })

    // Mock that Amazon responds quickly
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    amazonBidder.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 80)
      })
    })

    const googletagMockRefresh = jest.fn()
    __setPubadsRefreshMock(googletagMockRefresh)

    require('js/ads/ads')
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).not.toHaveBeenCalled()
    jest.advanceTimersByTime(3e3)
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)
  })

  it('calls the ad server immediately when all bidders respond before the timeout', async () => {
    expect.assertions(1)

    // Mock that Prebid responds quickly
    const prebidConfig = require('js/ads/prebid/prebidConfig').default
    prebidConfig.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 40)
      })
    })

    // Mock that Amazon responds quickly
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    amazonBidder.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 40)
      })
    })

    const googletagMockRefresh = jest.fn()
    __setPubadsRefreshMock(googletagMockRefresh)

    require('js/ads/ads')
    jest.advanceTimersByTime(41)
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)
  })

  it('only calls the ad server once when all bidders respond before the timeout', async () => {
    expect.assertions(2)

    // Mock that Prebid responds quickly
    const prebidConfig = require('js/ads/prebid/prebidConfig').default
    prebidConfig.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 40)
      })
    })

    // Mock that Amazon responds quickly
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    amazonBidder.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 40)
      })
    })

    const googletagMockRefresh = jest.fn()
    __setPubadsRefreshMock(googletagMockRefresh)

    require('js/ads/ads')
    jest.advanceTimersByTime(41)
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(20e3)
    await new Promise(resolve => setImmediate(resolve))

    expect(googletagMockRefresh).toHaveBeenCalledTimes(1)
  })

  it('calls to store Amazon bids on the window for analytics (if Amazon is included in the auction)', async () => {
    expect.assertions(1)
    const storeAmazonBids = require('js/ads/amazon/amazonBidder').storeAmazonBids

    // Mock that Amazon responds quickly
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    amazonBidder.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 80)
      })
    })

    require('js/ads/ads')
    jest.advanceTimersByTime(100)
    await new Promise(resolve => setImmediate(resolve))
    expect(storeAmazonBids).toHaveBeenCalledTimes(1)
  })

  it('does not call to store Amazon bids on the window for analytics (if Amazon is not included in the auction)', async () => {
    expect.assertions(1)
    const storeAmazonBids = require('js/ads/amazon/amazonBidder').storeAmazonBids

    // Mock that Amazon responds slowly
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    amazonBidder.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 15e3)
      })
    })

    require('js/ads/ads')
    jest.advanceTimersByTime(3e3)
    await new Promise(resolve => setImmediate(resolve))
    expect(storeAmazonBids).not.toHaveBeenCalled()
  })

  it('calls handleAdsLoaded', async () => {
    expect.assertions(1)
    const handleAdsLoaded = require('js/ads/handleAdsLoaded').default
    require('js/ads/ads')
    expect(handleAdsLoaded).toHaveBeenCalledTimes(1)
  })
})
