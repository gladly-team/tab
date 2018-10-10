/* eslint-env jest */

import setUpGoogleAds from 'js/ads/google/setUpGoogleAds'
import getGoogleTag from 'js/ads/google/getGoogleTag'

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
      ['/43865596/HBTL', expect.any(Array), 'div-gpt-ad-1464385677836-0']
    )
    expect(googletag.defineSlot.mock.calls[1]).toEqual(
      ['/43865596/HBTR', expect.any(Array), 'div-gpt-ad-1464385742501-0']
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
