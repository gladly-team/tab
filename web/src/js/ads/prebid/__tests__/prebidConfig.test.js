/* eslint-env jest */

import prebidConfig from 'js/ads/prebid/prebidConfig'
import getGoogleTag from 'js/ads/google/getGoogleTag'
import getPrebidPbjs, {
  __disableAutomaticBidResponses,
  __runBidsBack
} from 'js/ads/prebid/getPrebidPbjs'
import { getDefaultTabGlobal } from 'js/utils/test-utils'
import {
  getVerticalAdSizes,
  getHorizontalAdSizes
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

  it('uses ad sizes from the ad settings', async () => {
    expect.assertions(3)
    getVerticalAdSizes
      .mockReturnValueOnce([[250, 250], [300, 600]])
      .mockReturnValueOnce([[300, 250]])
    getHorizontalAdSizes.mockReturnValueOnce([[728, 90], [720, 300]])
    const pbjs = getPrebidPbjs()
    await prebidConfig()

    const adUnitConfig = pbjs.addAdUnits.mock.calls[0][0]
    expect(adUnitConfig[0]['mediaTypes']['banner']['sizes'])
      .toEqual([[250, 250], [300, 600]])
    expect(adUnitConfig[1]['mediaTypes']['banner']['sizes'])
      .toEqual([[300, 250]])
    expect(adUnitConfig[2]['mediaTypes']['banner']['sizes'])
      .toEqual([[728, 90], [720, 300]])
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
})
