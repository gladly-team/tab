/* eslint-env jest */

import {
  getDefaultTabGlobal,
  mockAmazonBidResponse
} from 'utils/test-utils'

jest.mock('../apstag')
jest.mock('../../consentManagement')

beforeEach(() => {
  delete window.googletag
  delete window.apstag

  // Mock googletag
  const mockAddEventListener = jest.fn()
  window.googletag = {
    cmd: [],
    pubads: () => ({
      addEventListener: mockAddEventListener
    })
  }

  // Mock apstag
  window.apstag = require('apstag')

  // Mock tabforacause global
  window.tabforacause = getDefaultTabGlobal()
  // featureFlag-gdprConsent
  window.tabforacause.featureFlags.gdprConsent = true

  jest.clearAllMocks()
  jest.resetModules()
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
  it('calls apstag.fetchBids', () => {
    const amazonBidder = require('../amazonBidder').default
    amazonBidder()

    expect(window.apstag.fetchBids).toHaveBeenCalled()
    expect(window.apstag.fetchBids.mock.calls[0][0]).toEqual({
      slots: [
        {
          slotID: 'div-gpt-ad-1464385742501-0',
          sizes: [[300, 250]]
        },
        {
          slotID: 'div-gpt-ad-1464385677836-0',
          sizes: [[728, 90]]
        }
      ],
      timeout: 1000
    })
  })

  it('calls apstag.setDisplayBids when bids return', () => {
    // Mock apstag's `fetchBids` so we can invoke the callback function
    var passedCallback
    window.apstag.fetchBids.mockImplementation((config, callback) => {
      passedCallback = callback
    })

    const amazonBidder = require('../amazonBidder').default
    amazonBidder()

    // Fake that apstag calls callback for returned bids
    passedCallback([
      mockAmazonBidResponse()
    ])

    // Run the queued googletag commands
    window.googletag.cmd.forEach((cmd) => cmd())

    expect(window.apstag.setDisplayBids).toHaveBeenCalled()
  })

  it('stores Amazon bids in tabforacause window variable', async () => {
    expect.assertions(2)

    // Mock apstag's `fetchBids` so we can invoke the callback function
    var passedCallback
    window.apstag.fetchBids.mockImplementation((config, callback) => {
      passedCallback = callback
    })

    const amazonBidder = require('../amazonBidder').default
    await amazonBidder()

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

    // Run the queued googletag commands
    window.googletag.cmd.forEach((cmd) => cmd())

    expect(window.tabforacause.ads.amazonBids['div-gpt-ad-123456789-0'])
      .toEqual(someBid)
    expect(window.tabforacause.ads.amazonBids['div-gpt-ad-24681357-0'])
      .toEqual(someOtherBid)
  })

  it('calls apstag.init with the expected publisher ID and ad server', async () => {
    expect.assertions(1)
    const amazonBidder = require('../amazonBidder').default
    await amazonBidder()

    expect(window.apstag.init.mock.calls[0][0]).toMatchObject({
      pubID: '3397',
      adServer: 'googletag'
    })
  })

  it('does not include GDPR consent when not in the EU', async () => {
    expect.assertions(1)
    const amazonBidder = require('../amazonBidder').default
    await amazonBidder(false)
    expect(window.apstag.init.mock.calls[0][0]['gdpr']).toBeUndefined()
  })

  it('includes GDPR consent when in the EU', async () => {
    expect.assertions(1)
    const getConsentString = require('../../consentManagement').getConsentString
    getConsentString.mockReturnValue(Promise.resolve('the-consent-string'))
    const amazonBidder = require('../amazonBidder').default
    await amazonBidder(true)
    expect(window.apstag.init.mock.calls[0][0]['gdpr']).toMatchObject({
      enabled: true,
      consent: 'the-consent-string'
    })
  })

  it('does not include GDPR consent when the feature flag is not enabled (even when in the EU)', async () => {
    expect.assertions(1)

    // featureFlag-gdprConsent
    window.tabforacause.featureFlags.gdprConsent = false

    const amazonBidder = require('../amazonBidder').default
    await amazonBidder(true)
    expect(window.apstag.init.mock.calls[0][0]['gdpr']).toBeUndefined()
  })

  it('times out and initializes Amazon when the CMP takes a long time to respond with consent', async () => {
    expect.assertions(3)

    // Mock that the CMP is very slow to respond
    jest.useFakeTimers()
    const getConsentString = require('../../consentManagement').getConsentString
    getConsentString.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve('abc') }, 15e3)
      })
    })

    const amazonBidder = require('../amazonBidder').default
    amazonBidder(true)

    // Some time has passed, but not enough to time out waiting
    // for the CMP.
    jest.advanceTimersByTime(1e3)

    // Should still be waiting for the CMP
    expect(window.apstag.init).not.toHaveBeenCalled()

    // Enough time has passed to stop waiting for the CMP.
    jest.advanceTimersByTime(6e3)

    // Should have initialized Amazon.
    expect(window.apstag.init.mock.calls[0][0]['gdpr']).toMatchObject({
      enabled: true,
      consent: null
    })

    jest.runAllTimers()
    expect(window.apstag.init).toHaveBeenCalledTimes(1)
  })

  it('only initializes Amazon once when the CMP responds with consent', async () => {
    expect.assertions(1)

    // Mock that the CMP is very slow to respond
    jest.useFakeTimers()
    const getConsentString = require('../../consentManagement').getConsentString
    getConsentString.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => { resolve('abc') }, 1e3)
      })
    })
    const amazonBidder = require('../amazonBidder').default
    amazonBidder(true)
    jest.runAllTimers()
    expect(window.apstag.init).toHaveBeenCalledTimes(1)
  })
})
