/* eslint-env jest */

jest.mock('js/ads/adSettings')
jest.mock('js/ads/indexExchange/getIndexExchangeTag')
jest.mock('js/ads/google/getGoogleTag')
jest.mock('js/utils/logger')

beforeAll(() => {
  jest.useFakeTimers()
})

beforeEach(() => {
  // Mock the IX tag
  delete window.headertag
  const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
    .default
  window.headertag = getIndexExchangeTag()

  // Set up googletag
  delete window.googletag
  const getGoogleTag = require('js/ads/google/getGoogleTag').default
  window.googletag = getGoogleTag()
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  delete window.headertag
  delete window.googletag
})

describe('indexExchangeBidder', () => {
  it('runs without error', async () => {
    expect.assertions(0)
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    await indexExchangeBidder()
  })

  it('only gets bids for the leaderboard ad when one ad is enabled', async () => {
    expect.assertions(2)
    const { getNumberOfAdsToShow } = require('js/ads/adSettings')
    getNumberOfAdsToShow.mockReturnValue(1)
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
      .default
    const ixTag = getIndexExchangeTag()
    await indexExchangeBidder()
    expect(ixTag.retrieveDemand).toHaveBeenCalled()
    expect(ixTag.retrieveDemand.mock.calls[0][0]).toEqual([
      { htSlotName: 'd-1-728x90-atf-bottom-leaderboard' },
    ])
  })

  it('gets bids for the leaderboard and rectangle ads when two ads are enabled', async () => {
    expect.assertions(2)
    const { getNumberOfAdsToShow } = require('js/ads/adSettings')
    getNumberOfAdsToShow.mockReturnValue(2)
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
      .default
    const ixTag = getIndexExchangeTag()
    await indexExchangeBidder()
    expect(ixTag.retrieveDemand).toHaveBeenCalled()
    expect(ixTag.retrieveDemand.mock.calls[0][0]).toEqual([
      { htSlotName: 'd-1-728x90-atf-bottom-leaderboard' },
      { htSlotName: 'd-3-300x250-atf-bottom-right_rectangle' },
    ])
  })

  it('gets bids for the leaderboard and rectangle ads when three ads are enabled', async () => {
    expect.assertions(2)
    const { getNumberOfAdsToShow } = require('js/ads/adSettings')
    getNumberOfAdsToShow.mockReturnValue(3)
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
      .default
    const ixTag = getIndexExchangeTag()
    await indexExchangeBidder()
    expect(ixTag.retrieveDemand).toHaveBeenCalled()
    expect(ixTag.retrieveDemand.mock.calls[0][0]).toEqual([
      { htSlotName: 'd-1-728x90-atf-bottom-leaderboard' },
      { htSlotName: 'd-3-300x250-atf-bottom-right_rectangle' },
      { htSlotName: 'd-2-300x250-atf-middle-right_rectangle' },
    ])
  })

  it('the bidder resolves when the bid response returns', done => {
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
      .default
    const ixTag = getIndexExchangeTag()

    let retrieveDemandCallback
    ixTag.retrieveDemand.mockImplementation((config, callback) => {
      retrieveDemandCallback = callback
    })
    indexExchangeBidder().then(() => {
      done()
    })
    retrieveDemandCallback()
  })

  it('the bidder resolves when we pass the bidder timeout', done => {
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
      .default
    const ixTag = getIndexExchangeTag()

    // Mock that retrieveDemand never calls the callback.
    ixTag.retrieveDemand.mockImplementation(() => {})
    indexExchangeBidder().then(() => {
      done()
    })

    // Here, bidder timeout is 700ms.
    jest.advanceTimersByTime(701)
  })

  it('sets the expected targeting for Google Ad Manager when all slots have bids', async () => {
    expect.assertions(6)
    const getGoogleTag = require('js/ads/google/getGoogleTag').default
    const googletag = getGoogleTag()

    // Mock the bid response.
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
      .default
    const ixTag = getIndexExchangeTag()
    const { mockIndexExchangeBidResponse } = require('js/utils/test-utils')
    const mockBidResponse = mockIndexExchangeBidResponse()
    ixTag.retrieveDemand.mockImplementation((config, callback) =>
      callback(mockBidResponse)
    )
    await indexExchangeBidder()
    const googleSlots = googletag.pubads().getSlots()
    const [leaderboardSlot, rectangleSlot, secondRectangleSlot] = googleSlots
    expect(leaderboardSlot.setTargeting).toHaveBeenCalledWith('IOM', [
      '728x90_5000',
    ])
    expect(leaderboardSlot.setTargeting).toHaveBeenCalledWith('ix_id', [
      '_mBnLnF5V',
    ])
    expect(rectangleSlot.setTargeting).toHaveBeenCalledWith('IOM', [
      '300x250_5000',
    ])
    expect(rectangleSlot.setTargeting).toHaveBeenCalledWith('ix_id', [
      '_C7VB5HUd',
    ])
    expect(secondRectangleSlot.setTargeting).toHaveBeenCalledWith(
      'ad_thing',
      'thingy_abc'
    )
    expect(secondRectangleSlot.setTargeting).toHaveBeenCalledWith(
      'some_key',
      'my-cool-value123'
    )
  })

  it('sets targeting for multiple bids on a single slot', async () => {
    expect.assertions(3)
    const getGoogleTag = require('js/ads/google/getGoogleTag').default
    const googletag = getGoogleTag()

    // Mock the bid response.
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
      .default
    const ixTag = getIndexExchangeTag()
    ixTag.retrieveDemand.mockImplementation((config, callback) =>
      callback({
        slot: {
          'd-1-728x90-atf-bottom-leaderboard': [
            {
              targeting: {
                IOM: ['728x90_5000'],
                ix_id: ['_some_ix_id'],
              },
              price: 7000,
              adm: '',
              size: [728, 90],
              partnerId: 'IndexExchangeHtb',
            },
            {
              targeting: {
                partner_thing: ['foobar'],
              },
              price: 5000,
              adm: '',
              size: [728, 90],
              partnerId: 'AnotherPartner',
            },
          ],
        },
        page: [],
        identity: {},
      })
    )
    await indexExchangeBidder()
    const [leaderboardSlot] = googletag.pubads().getSlots()
    expect(leaderboardSlot.setTargeting).toHaveBeenCalledWith('IOM', [
      '728x90_5000',
    ])
    expect(leaderboardSlot.setTargeting).toHaveBeenCalledWith('ix_id', [
      '_some_ix_id',
    ])
    expect(leaderboardSlot.setTargeting).toHaveBeenCalledWith('partner_thing', [
      'foobar',
    ])
  })

  it('does not throw, log an error, or set targeting if the bid response is undefined', async () => {
    expect.assertions(4)
    const logger = require('js/utils/logger').default
    const getGoogleTag = require('js/ads/google/getGoogleTag').default
    const googletag = getGoogleTag()

    // Mock the bid response.
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
      .default
    const ixTag = getIndexExchangeTag()
    ixTag.retrieveDemand.mockImplementation((config, callback) =>
      callback(undefined)
    )
    await indexExchangeBidder()
    expect(logger.error).not.toHaveBeenCalled()
    googletag
      .pubads()
      .getSlots()
      .forEach(slot => {
        expect(slot.setTargeting).not.toHaveBeenCalled()
      })
  })

  it('does not throw, log an error, or set targeting if the bid response is an empty object', async () => {
    expect.assertions(4)
    const logger = require('js/utils/logger').default
    const getGoogleTag = require('js/ads/google/getGoogleTag').default
    const googletag = getGoogleTag()

    // Mock the bid response.
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
      .default
    const ixTag = getIndexExchangeTag()
    ixTag.retrieveDemand.mockImplementation((config, callback) => callback({}))
    await indexExchangeBidder()
    expect(logger.error).not.toHaveBeenCalled()
    googletag
      .pubads()
      .getSlots()
      .forEach(slot => {
        expect(slot.setTargeting).not.toHaveBeenCalled()
      })
  })

  it('does not throw, log an error, or set targeting if the bid response has no slot responses', async () => {
    expect.assertions(4)
    const logger = require('js/utils/logger').default
    const getGoogleTag = require('js/ads/google/getGoogleTag').default
    const googletag = getGoogleTag()

    // Mock the bid response.
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
      .default
    const ixTag = getIndexExchangeTag()
    ixTag.retrieveDemand.mockImplementation((config, callback) =>
      callback({
        slot: {},
        page: [],
        identity: {},
      })
    )
    await indexExchangeBidder()
    expect(logger.error).not.toHaveBeenCalled()
    googletag
      .pubads()
      .getSlots()
      .forEach(slot => {
        expect(slot.setTargeting).not.toHaveBeenCalled()
      })
  })

  it('does not throw, log an error, or set targeting if IX returns an unexpected slot ID', async () => {
    expect.assertions(4)
    const logger = require('js/utils/logger').default
    const getGoogleTag = require('js/ads/google/getGoogleTag').default
    const googletag = getGoogleTag()

    // Mock the bid response.
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
      .default
    const ixTag = getIndexExchangeTag()
    ixTag.retrieveDemand.mockImplementation((config, callback) =>
      callback({
        slot: {
          'this-slot-does-not-exist-for-us': [
            {
              targeting: {
                IOM: ['728x90_5000'],
                ix_id: ['_mBnLnF5V'],
              },
              price: 7000,
              adm: '',
              size: [728, 90],
              partnerId: 'IndexExchangeHtb',
            },
          ],
        },
        page: [],
        identity: {},
      })
    )
    await indexExchangeBidder()
    expect(logger.error).not.toHaveBeenCalled()
    googletag
      .pubads()
      .getSlots()
      .forEach(slot => {
        expect(slot.setTargeting).not.toHaveBeenCalled()
      })
  })

  it('does not throw, log an error, or set targeting if IX does not define targeting values for a slot', async () => {
    expect.assertions(4)
    const logger = require('js/utils/logger').default
    const getGoogleTag = require('js/ads/google/getGoogleTag').default
    const googletag = getGoogleTag()

    // Mock the bid response.
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
      .default
    const ixTag = getIndexExchangeTag()
    ixTag.retrieveDemand.mockImplementation((config, callback) =>
      callback({
        slot: {
          'd-1-728x90-atf-bottom-leaderboard': [
            {
              targeting: {},
              price: 7000,
              adm: '',
              size: [728, 90],
              partnerId: 'IndexExchangeHtb',
            },
          ],
        },
        page: [],
        identity: {},
      })
    )
    await indexExchangeBidder()
    expect(logger.error).not.toHaveBeenCalled()
    googletag
      .pubads()
      .getSlots()
      .forEach(slot => {
        expect(slot.setTargeting).not.toHaveBeenCalled()
      })
  })

  it('stores the bids in the tab global for analytics', async () => {
    expect.assertions(3)
    const { getTabGlobal } = require('js/utils/utils')
    const tabGlobal = getTabGlobal()

    // Mock the bid response.
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
      .default
    const ixTag = getIndexExchangeTag()
    const { mockIndexExchangeBidResponse } = require('js/utils/test-utils')
    const mockBidResponse = mockIndexExchangeBidResponse()
    ixTag.retrieveDemand.mockImplementation((config, callback) =>
      callback(mockBidResponse)
    )
    await indexExchangeBidder()
    const {
      VERTICAL_AD_SLOT_DOM_ID,
      SECOND_VERTICAL_AD_SLOT_DOM_ID,
      HORIZONTAL_AD_SLOT_DOM_ID,
    } = require('js/ads/adSettings')
    expect(tabGlobal.ads.indexExchangeBids[HORIZONTAL_AD_SLOT_DOM_ID]).toEqual([
      {
        targeting: {
          IOM: ['728x90_5000'],
          ix_id: ['_mBnLnF5V'],
        },
        price: 7000,
        adm: '',
        size: [728, 90],
        partnerId: 'IndexExchangeHtb',
      },
    ])
    expect(tabGlobal.ads.indexExchangeBids[VERTICAL_AD_SLOT_DOM_ID]).toEqual([
      {
        targeting: {
          IOM: ['300x250_5000'],
          ix_id: ['_C7VB5HUd'],
        },
        price: 3500,
        adm: '_admcodehere_',
        size: [300, 250],
        partnerId: 'IndexExchangeHtb',
      },
    ])
    expect(
      tabGlobal.ads.indexExchangeBids[SECOND_VERTICAL_AD_SLOT_DOM_ID]
    ).toEqual([
      {
        targeting: {
          some_key: 'my-cool-value123',
          ad_thing: 'thingy_abc',
        },
        price: 5000,
        adm: '_admcodehere_',
        size: [300, 250],
        partnerId: 'SomePartner',
      },
    ])
  })
})

describe('markIndexExchangeBidsAsIncluded', () => {
  it('sets the IX bids "includedInAdServerRequest" property to true', () => {
    const { getTabGlobal } = require('js/utils/utils')
    const tabGlobal = getTabGlobal()
    expect(tabGlobal.ads.indexExchangeBids.includedInAdServerRequest).toBe(
      false
    )
    const {
      markIndexExchangeBidsAsIncluded,
    } = require('js/ads/indexExchange/indexExchangeBidder')
    markIndexExchangeBidsAsIncluded()
    expect(tabGlobal.ads.indexExchangeBids.includedInAdServerRequest).toBe(true)
  })
})
