/* eslint-env jest */

jest.mock('js/ads/adSettings')
jest.mock('js/ads/indexExchange/getIndexExchangeTag')

beforeEach(() => {
  // Mock the IX tag
  delete window.headertag
  const getIndexExchangeTag = require('js/ads/indexExchange/getIndexExchangeTag')
    .default
  window.headertag = getIndexExchangeTag()

  // Mock tabforacause global
  const { getDefaultTabGlobal } = require('js/utils/test-utils')
  window.tabforacause = getDefaultTabGlobal()

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
  delete window.tabforacause
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

  // TODO:
  // test handling response
  // test timeout
})
