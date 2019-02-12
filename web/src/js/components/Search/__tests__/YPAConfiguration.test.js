/* eslint-env jest */

afterEach(() => {
  jest.resetModules()
})

describe('YPA configuration', () => {
  it('contains the expected YPA ad config ID', () => {
    const YPAConfiguration = require('js/components/Search/YPAConfiguration')
      .default
    expect(YPAConfiguration).toMatchObject({
      ypaAdConfig: '00000129a',
    })
  })

  it('contains the expected target search ad div ID', () => {
    const YPAConfiguration = require('js/components/Search/YPAConfiguration')
      .default
    // Important: don't change the div ID without updating our DOM.
    expect(YPAConfiguration.ypaAdSlotInfo[0].ypaAdDivId).toEqual('search-ads')
  })

  it('contains the expected target search results div ID', () => {
    const YPAConfiguration = require('js/components/Search/YPAConfiguration')
      .default
    // Important: don't change the div ID without updating our DOM.
    expect(YPAConfiguration.ypaAdSlotInfo[1].ypaAdDivId).toEqual(
      'search-results'
    )
  })

  it('does not allow adult ads', () => {
    const YPAConfiguration = require('js/components/Search/YPAConfiguration')
      .default
    expect(YPAConfiguration.ypaAdTagOptions.adultFilter).toBe(false)
  })

  it('enables 3 ads on desktop', () => {
    const YPAConfiguration = require('js/components/Search/YPAConfiguration')
      .default
    expect(
      YPAConfiguration.ypaAdSlotInfo[0].ypaSlotOptions.AdOptions.DeskTop.AdRange
    ).toEqual('1-3')
  })

  it('enables 2 ads on mobile', () => {
    const YPAConfiguration = require('js/components/Search/YPAConfiguration')
      .default
    expect(
      YPAConfiguration.ypaAdSlotInfo[0].ypaSlotOptions.AdOptions.Mobile.AdRange
    ).toEqual('1-2')
  })
})
