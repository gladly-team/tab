/* eslint-env jest */

import setUpGoogleAds from 'js/ads/google/setUpGoogleAds'
import getGoogleTag from 'js/ads/google/getGoogleTag'
import {
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

  it('defines the ad slots', () => {
    setUpGoogleAds()
    const googletag = getGoogleTag()
    expect(googletag.defineSlot.mock.calls[0]).toEqual(
      ['/99887766/HBTL', expect.any(Array), 'div-gpt-ad-24682468-0']
    )
    expect(googletag.defineSlot.mock.calls[1]).toEqual(
      ['/11223344/HBTR', expect.any(Array), 'div-gpt-ad-1357913579-0']
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
