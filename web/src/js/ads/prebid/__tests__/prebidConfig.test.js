/* eslint-env jest */

import prebidConfig from 'js/ads/prebid/prebidConfig'
import getGoogleTag from 'js/ads/google/getGoogleTag'
import getPrebidPbjs, {
  __disableAutomaticBidResponses,
  __runBidsBack
} from 'js/ads/prebid/getPrebidPbjs'
import { getDefaultTabGlobal } from 'js/utils/test-utils'
import {
  getNumberOfAdsToShow,
  getVerticalAdSizes,
  getHorizontalAdSizes,
  VERTICAL_AD_SLOT_DOM_ID,
  SECOND_VERTICAL_AD_SLOT_DOM_ID,
  HORIZONTAL_AD_SLOT_DOM_ID
} from 'js/ads/adSettings'

jest.mock('js/ads/adSettings')
jest.mock('js/ads/prebid/getPrebidPbjs')
jest.mock('js/utils/client-location')

beforeEach(() => {
  window.tabforacause = getDefaultTabGlobal()

  delete window.pbjs
  window.pbjs = getPrebidPbjs()

  // Set up googletag
  delete window.googletag
  window.googletag = getGoogleTag()
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  delete window.googletag
  delete window.pbjs
})

describe('prebidConfig', function () {
  it('runs without error', async () => {
    expect.assertions(0)
    await prebidConfig()
  })

  it('sets the config', async () => {
    expect.assertions(2)

    const pbjs = getPrebidPbjs()
    await prebidConfig()

    const config = pbjs.setConfig.mock.calls[0][0]

    expect(config['pageUrl']).toBeDefined()
    expect(config['publisherDomain']).toBeDefined()
  })

  it('sets up ad units', async () => {
    expect.assertions(3)

    const pbjs = getPrebidPbjs()
    await prebidConfig()

    const adUnitConfig = pbjs.addAdUnits.mock.calls[0][0]
    expect(adUnitConfig[0]['code']).toBeDefined()
    expect(adUnitConfig[0]['mediaTypes']).toBeDefined()
    expect(adUnitConfig[0]['bids']).toBeDefined()
  })

  it('includes the consentManagement setting when in the EU', async () => {
    expect.assertions(1)

    // Mock that the client is in the EU
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    const pbjs = getPrebidPbjs()
    await prebidConfig()

    expect(pbjs.setConfig.mock.calls[0][0]['consentManagement']).not.toBeUndefined()
  })

  it('resolves immediately when we expect the mock to return bids immediately', async () => {
    expect.assertions(1)

    const promise = prebidConfig()
    promise.done = false
    promise.then(() => { promise.done = true })

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))
    expect(promise.done).toBe(true)
  })

  it('only resolves after the auction ends', async () => {
    expect.assertions(2)
    __disableAutomaticBidResponses()

    const promise = prebidConfig()
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

  it('does not include consentManagement setting when not in the EU', async () => {
    expect.assertions(1)

    // Mock that the client is not in the EU
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(false)

    const pbjs = getPrebidPbjs()
    await prebidConfig()

    expect(pbjs.setConfig.mock.calls[0][0]['consentManagement']).toBeUndefined()
  })

  it('uses ad sizes from the ad settings', async () => {
    expect.assertions(3)
    getNumberOfAdsToShow.mockReturnValue(3)
    getVerticalAdSizes.mockReturnValue([[250, 250]])
    getHorizontalAdSizes.mockReturnValue([[728, 90]])
    const pbjs = getPrebidPbjs()
    await prebidConfig()

    const adUnitConfig = pbjs.addAdUnits.mock.calls[0][0]
    expect(adUnitConfig[0]['mediaTypes']['banner']['sizes'])
      .toEqual([[728, 90]])
    expect(adUnitConfig[1]['mediaTypes']['banner']['sizes'])
      .toEqual([[250, 250]])
    expect(adUnitConfig[2]['mediaTypes']['banner']['sizes'])
      .toEqual([[250, 250]])
  })

  it('gets bids for only the horizontal ad when there is only one ad', async () => {
    expect.assertions(2)
    getNumberOfAdsToShow.mockReturnValueOnce(1)
    const pbjs = getPrebidPbjs()
    await prebidConfig()

    const adUnitConfig = pbjs.addAdUnits.mock.calls[0][0]
    expect(adUnitConfig.length).toBe(1)
    expect(adUnitConfig[0]['code']).toBe(HORIZONTAL_AD_SLOT_DOM_ID)
  })

  it('gets bids for the horizontal ad and vertical ad when there are two ads', async () => {
    expect.assertions(3)
    getNumberOfAdsToShow.mockReturnValueOnce(2)
    const pbjs = getPrebidPbjs()
    await prebidConfig()

    const adUnitConfig = pbjs.addAdUnits.mock.calls[0][0]
    expect(adUnitConfig.length).toBe(2)
    expect(adUnitConfig[0]['code']).toBe(HORIZONTAL_AD_SLOT_DOM_ID)
    expect(adUnitConfig[1]['code']).toBe(VERTICAL_AD_SLOT_DOM_ID)
  })

  it('gets bids for the horizontal ad and two vertical ads when there are three ads', async () => {
    expect.assertions(4)
    getNumberOfAdsToShow.mockReturnValueOnce(3)
    const pbjs = getPrebidPbjs()
    await prebidConfig()

    const adUnitConfig = pbjs.addAdUnits.mock.calls[0][0]
    expect(adUnitConfig.length).toBe(3)
    expect(adUnitConfig[0]['code']).toBe(HORIZONTAL_AD_SLOT_DOM_ID)
    expect(adUnitConfig[1]['code']).toBe(VERTICAL_AD_SLOT_DOM_ID)
    expect(adUnitConfig[2]['code']).toBe(SECOND_VERTICAL_AD_SLOT_DOM_ID)
  })

  it('when there is one ad, the list of bidders for the ad match what is expected', async () => {
    expect.assertions(1)
    getNumberOfAdsToShow.mockReturnValueOnce(1)
    const pbjs = getPrebidPbjs()
    await prebidConfig()
    const adUnitConfig = pbjs.addAdUnits.mock.calls[0][0]
    expect(
      adUnitConfig[0]['bids'].map(bid => bid.bidder).sort())
      .toEqual([
        'aol',
        'brealtime',
        'openx',
        'pulsepoint',
        'rhythmone',
        'sonobi',
        'sovrn'
      ])
  })

  it('when there are two ads, the list of bidders for each ad match what is expected', async () => {
    expect.assertions(2)
    getNumberOfAdsToShow.mockReturnValueOnce(2)
    const pbjs = getPrebidPbjs()
    await prebidConfig()
    const adUnitConfig = pbjs.addAdUnits.mock.calls[0][0]
    expect(
      adUnitConfig[0]['bids'].map(bid => bid.bidder).sort())
      .toEqual([
        'aol',
        'brealtime',
        'openx',
        'pulsepoint',
        'rhythmone',
        'sonobi',
        'sovrn'
      ])
    expect(
      adUnitConfig[1]['bids'].map(bid => bid.bidder).sort())
      .toEqual([
        'aol',
        'brealtime',
        'openx',
        'pulsepoint',
        'rhythmone',
        'sonobi',
        'sovrn'
      ])
  })

  it('when there are three ads, the list of bidders for each ad match what is expected', async () => {
    expect.assertions(3)
    getNumberOfAdsToShow.mockReturnValueOnce(3)
    const pbjs = getPrebidPbjs()
    await prebidConfig()
    const adUnitConfig = pbjs.addAdUnits.mock.calls[0][0]

    expect(
      adUnitConfig[0]['bids'].map(bid => bid.bidder).sort())
      .toEqual([
        'aol',
        'brealtime',
        'openx',
        'pulsepoint',
        'rhythmone',
        'sonobi',
        'sovrn'
      ])
    expect(
      adUnitConfig[1]['bids'].map(bid => bid.bidder).sort())
      .toEqual([
        'aol',
        'brealtime',
        'openx',
        'pulsepoint',
        'rhythmone',
        'sonobi',
        'sovrn'
      ])
    expect(
      adUnitConfig[2]['bids'].map(bid => bid.bidder).sort())
      .toEqual([
        'aol',
        // 'brealtime',
        'openx',
        'pulsepoint',
        // 'rhythmone',
        'sonobi',
        'sovrn'
      ])
  })
})
