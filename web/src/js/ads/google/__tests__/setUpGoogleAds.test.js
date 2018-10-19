/* eslint-env jest */

import setUpGoogleAds from 'js/ads/google/setUpGoogleAds'
import getGoogleTag from 'js/ads/google/getGoogleTag'
import {
  getNumberOfAdsToShow,
  getVerticalAdSizes,
  getHorizontalAdSizes
} from 'js/ads/adSettings'

jest.mock('js/ads/adSettings')
jest.mock('js/ads/google/getGoogleTag')

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  delete window.googletag
})

describe('setUpGoogleAds', function () {
  it('runs without error', () => {
    setUpGoogleAds()
  })

  it('does not define ad slots when showing zero ads', () => {
    getNumberOfAdsToShow.mockReturnValue(0)
    setUpGoogleAds()
    const googletag = getGoogleTag()
    expect(googletag.defineSlot).not.toHaveBeenCalled()
  })

  it('defines the expected ad slots when showing 1 ad', () => {
    getNumberOfAdsToShow.mockReturnValue(1)
    setUpGoogleAds()
    const googletag = getGoogleTag()
    expect(googletag.defineSlot.mock.calls.length).toBe(1)
    expect(googletag.defineSlot.mock.calls[0]).toEqual(
      ['/99887766/HBTL', expect.any(Array), 'div-gpt-ad-24682468-0']
    )
  })

  it('defines the expected ad slots when showing 2 ads', () => {
    getNumberOfAdsToShow.mockReturnValue(2)
    setUpGoogleAds()
    const googletag = getGoogleTag()
    expect(googletag.defineSlot.mock.calls.length).toBe(2)
    expect(googletag.defineSlot.mock.calls[0]).toEqual(
      ['/99887766/HBTL', expect.any(Array), 'div-gpt-ad-24682468-0']
    )
    expect(googletag.defineSlot.mock.calls[1]).toEqual(
      ['/11223344/HBTR', expect.any(Array), 'div-gpt-ad-1357913579-0']
    )
  })

  it('defines the expected ad slots when showing 3 ads', () => {
    getNumberOfAdsToShow.mockReturnValue(3)
    setUpGoogleAds()
    const googletag = getGoogleTag()
    expect(googletag.defineSlot.mock.calls.length).toBe(3)
    expect(googletag.defineSlot.mock.calls[0]).toEqual(
      ['/99887766/HBTL', expect.any(Array), 'div-gpt-ad-24682468-0']
    )
    expect(googletag.defineSlot.mock.calls[1]).toEqual(
      ['/11223344/HBTR', expect.any(Array), 'div-gpt-ad-1357913579-0']
    )
    expect(googletag.defineSlot.mock.calls[2]).toEqual(
      ['/44556677/HBTR2', expect.any(Array), 'div-gpt-ad-11235813-0']
    )
  })

  it('uses the ad sizes from the ad settings', () => {
    getVerticalAdSizes.mockReturnValueOnce([[250, 250], [300, 600]])
    getHorizontalAdSizes.mockReturnValueOnce([[728, 90], [720, 300]])
    setUpGoogleAds()
    const googletag = getGoogleTag()
    expect(googletag.defineSlot.mock.calls[0]).toEqual(
      ['/99887766/HBTL', [[728, 90], [720, 300]], 'div-gpt-ad-24682468-0']
    )
    expect(googletag.defineSlot.mock.calls[1]).toEqual(
      ['/11223344/HBTR', [[250, 250], [300, 600]], 'div-gpt-ad-1357913579-0']
    )
  })

  it('enables single request mode', () => {
    setUpGoogleAds()
    const googletag = getGoogleTag()
    expect(googletag.pubads().enableSingleRequest).toHaveBeenCalled()
  })

  it('enables ad services', () => {
    setUpGoogleAds()
    const googletag = getGoogleTag()
    expect(googletag.enableServices).toHaveBeenCalled()
  })
})
