/* eslint-env jest */

import getIndexExchangeTag from 'js/ads/indexExchange/getIndexExchangeTag'
import getGoogleTag from 'js/ads/google/getGoogleTag'
import { getDefaultTabGlobal } from 'js/utils/test-utils'
import { getNumberOfAdsToShow } from 'js/ads/adSettings'

jest.mock('js/ads/adSettings')
jest.mock('js/ads/indexExchange/getIndexExchangeTag')

beforeEach(() => {
  // Mock the IX tag
  delete window.headertag
  window.headertag = getIndexExchangeTag()

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
    getNumberOfAdsToShow.mockReturnValue(1)
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
      .default
    const ixTag = getIndexExchangeTag()
    await indexExchangeBidder()
    expect(ixTag.retrieveDemand).toHaveBeenCalled()
    expect(ixTag.retrieveDemand.mock.calls[0][0]).toEqual([
      { htSlotName: 'd-1-728x90-atf-bottom-leaderboard' },
    ])
  })

  it('gets bids for the leaderboard and rectangle ads when two ads are enabled', async () => {
    getNumberOfAdsToShow.mockReturnValue(2)
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
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
    getNumberOfAdsToShow.mockReturnValue(3)
    const indexExchangeBidder = require('js/ads/indexExchange/indexExchangeBidder')
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
