/* eslint-env jest */

jest.mock('../apstag')

beforeEach(() => {
  delete window.googletag
  delete window.apstag
  delete window.tabforacause

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
  window.tabforacause = {
    ads: {
      amazonBids: {},
      slotsLoaded: {},
      slotsAlreadyLoggedRevenue: {}
    }
  }

  jest.clearAllMocks()
  jest.resetModules()
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
    passedCallback([{
      amznbid: '1',
      amzniid: 'some-id',
      amznp: '1',
      amznsz: '0x0',
      size: '0x0',
      slotID: 'div-gpt-ad-123456789-0'
    }])

    // Run the queued googletag commands
    window.googletag.cmd.forEach((cmd) => cmd())

    expect(window.apstag.setDisplayBids).toHaveBeenCalled()
  })

  it('stores Amazon bids in tabforacause window variable', () => {
    // Mock apstag's `fetchBids` so we can invoke the callback function
    var passedCallback
    window.apstag.fetchBids.mockImplementation((config, callback) => {
      passedCallback = callback
    })

    const amazonBidder = require('../amazonBidder').default
    amazonBidder()

    // Fake that apstag calls callback for returned bids
    const someBid = {
      amznbid: '1',
      amzniid: 'some-other-id',
      amznp: '1',
      amznsz: '0x0',
      size: '0x0',
      slotID: 'div-gpt-ad-123456789-0'
    }
    const someOtherBid = {
      amznbid: '1',
      amzniid: 'some-id',
      amznp: '1',
      amznsz: '0x0',
      size: '0x0',
      slotID: 'div-gpt-ad-24681357-0'
    }
    passedCallback([someBid, someOtherBid])

    // Run the queued googletag commands
    window.googletag.cmd.forEach((cmd) => cmd())

    expect(window.tabforacause.ads.amazonBids['div-gpt-ad-123456789-0'])
      .toEqual(someBid)
    expect(window.tabforacause.ads.amazonBids['div-gpt-ad-24681357-0'])
      .toEqual(someOtherBid)
  })
})
