/* eslint-env jest */

import getAmazonTag, {
  __disableAutomaticBidResponses,
  __runBidsBack
} from 'js/ads/amazon/getAmazonTag'
import getGoogleTag from 'js/ads/google/getGoogleTag'
import {
  getDefaultTabGlobal,
  mockAmazonBidResponse
} from 'js/utils/test-utils'

jest.mock('js/ads/adSettings')
jest.mock('js/ads/consentManagement')
jest.mock('js/ads/amazon/getAmazonTag')

beforeEach(() => {
  // Mock apstag
  delete window.apstag
  window.apstag = getAmazonTag()

  // Mock tabforacause global
  window.tabforacause = getDefaultTabGlobal()

  // Set up googletag
  delete window.googletag
  window.googletag = getGoogleTag()
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  delete window.googletag
  delete window.apstag
  delete window.tabforacause
})

describe('amazonBidder', function () {
  it('runs without error', async () => {
    expect.assertions(0)
    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    await amazonBidder()
  })

  it('calls apstag.init with the expected publisher ID and ad server', async () => {
    expect.assertions(1)
    const apstag = getAmazonTag()

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    await amazonBidder()

    expect(apstag.init.mock.calls[0][0]).toMatchObject({
      pubID: '3397',
      adServer: 'googletag'
    })
  })

  it('calls apstag.fetchBids', async () => {
    const apstag = getAmazonTag()

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    await amazonBidder()

    expect(apstag.fetchBids).toHaveBeenCalled()
    expect(apstag.fetchBids.mock.calls[0][0]).toMatchObject({
      slots: [
        {
          slotID: 'div-gpt-ad-1357913579-0',
          sizes: [
            [300, 250]
          ]
        },
        {
          slotID: 'div-gpt-ad-24682468-0',
          sizes: [
            [728, 90]
          ]
        }
      ],
      timeout: 700
    })
  })

  it('uses ad sizes provided by the ads settings', async () => {
    const apstag = getAmazonTag()
    const {
      getVerticalAdSizes,
      getHorizontalAdSizes
    } = require('js/ads/adSettings')
    getVerticalAdSizes.mockReturnValueOnce([[250, 250], [300, 600]])
    getHorizontalAdSizes.mockReturnValueOnce([[728, 90], [720, 300]])

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    await amazonBidder()
    expect(apstag.fetchBids.mock.calls[0][0]).toMatchObject({
      slots: [
        {
          slotID: 'div-gpt-ad-1357913579-0',
          sizes: [
            [250, 250],
            [300, 600]
          ]
        },
        {
          slotID: 'div-gpt-ad-24682468-0',
          sizes: [
            [728, 90],
            [720, 300]
          ]
        }
      ],
      timeout: 700
    })
  })

  it('resolves immediately when we expect the mock to return bids immediately', async () => {
    expect.assertions(1)

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    const promise = amazonBidder()
    promise.done = false
    promise.then(() => { promise.done = true })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))
    expect(promise.done).toBe(true)
  })

  it('only resolves after the auction ends', async () => {
    expect.assertions(2)
    __disableAutomaticBidResponses()

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    const promise = amazonBidder()
    promise.done = false
    promise.then(() => { promise.done = true })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(promise.done).toBe(false)
    __runBidsBack()

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    expect(promise.done).toBe(true)
  })

  it('stores Amazon bids in tabforacause window variable', async () => {
    expect.assertions(4)

    // Mock apstag's `fetchBids` so we can invoke the callback function
    var passedCallback
    window.apstag.fetchBids.mockImplementation((config, callback) => {
      passedCallback = callback
    })

    const amazonBidder = require('js/ads/amazon/amazonBidder').default
    const storeAmazonBids = require('js/ads/amazon/amazonBidder').storeAmazonBids
    amazonBidder()

    // Fake that apstag calls callback for returned bids
    const someBid = mockAmazonBidResponse({
      amznbid: 'some-id',
      slotID: 'div-gpt-ad-123456789-0'
    })
    const someOtherBid = mockAmazonBidResponse({
      amznbid: 'some-other-id',
      slotID: 'div-gpt-ad-24681357-0'
    })
    passedCallback([someBid, someOtherBid])

    // Should not have stored the bids yet.
    expect(window.tabforacause.ads.amazonBids['div-gpt-ad-123456789-0'])
      .toBeUndefined()
    expect(window.tabforacause.ads.amazonBids['div-gpt-ad-24681357-0'])
      .toBeUndefined()

    storeAmazonBids()

    // Now should have stored the bids.
    expect(window.tabforacause.ads.amazonBids['div-gpt-ad-123456789-0'])
      .toEqual(someBid)
    expect(window.tabforacause.ads.amazonBids['div-gpt-ad-24681357-0'])
      .toEqual(someOtherBid)
  })
})
