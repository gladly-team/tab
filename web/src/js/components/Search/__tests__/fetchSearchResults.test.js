/* eslint-env jest */

import YPAConfiguration from 'js/components/Search/YPAConfiguration'

beforeAll(() => {
  window.ypaAds = {
    insertMultiAd: jest.fn(),
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('fetchSearchResults', () => {
  it('calls window.ypaAds.insertMultiAd', () => {
    const fetchSearchResults = require('js/components/Search/fetchSearchResults')
      .default
    fetchSearchResults()
    expect(window.ypaAds.insertMultiAd).toHaveBeenCalledTimes(1)
  })

  it('uses the YPA configuration', () => {
    const fetchSearchResults = require('js/components/Search/fetchSearchResults')
      .default
    fetchSearchResults()
    expect(window.ypaAds.insertMultiAd.mock.calls[0][0]).toMatchObject(
      YPAConfiguration
    )
  })

  it('sets the error callback in the YPA configuration', () => {
    const fetchSearchResults = require('js/components/Search/fetchSearchResults')
      .default
    const mockCallback = jest.fn()
    fetchSearchResults(null, mockCallback)
    const passedCallback =
      window.ypaAds.insertMultiAd.mock.calls[0][0].ypaAdSlotInfo[1].ypaOnNoAd
    passedCallback('foo')
    expect(mockCallback).toHaveBeenCalledWith('foo')
  })
})
