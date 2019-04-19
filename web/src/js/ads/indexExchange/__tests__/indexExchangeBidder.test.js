/* eslint-env jest */

import getIndexExchangeTag from 'js/ads/indexExchange/getIndexExchangeTag'
import getGoogleTag from 'js/ads/google/getGoogleTag'
import { getDefaultTabGlobal } from 'js/utils/test-utils'
// import { getNumberOfAdsToShow } from 'js/ads/adSettings'

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

  // TODO:
  // test one ad, two ads, three ads
  // test handling response
  // test timeout
})
