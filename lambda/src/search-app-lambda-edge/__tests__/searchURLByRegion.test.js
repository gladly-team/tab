afterEach(() => {
  jest.clearAllMocks()
})

const US_SEARCH_URL = 'https://search.yahoo.com'
const urlPath = '/yhs/search?hspart=gladly&hsimp=yhs-001'

const getExpectedURL = baseURL => baseURL + urlPath

describe('searchURLByRegion', () => {
  it('returns the US base URL when no arguments are provided', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion()).toEqual(getExpectedURL(US_SEARCH_URL))
  })

  it('returns the US base URL when an empty string country code is provided (no accept-language header)', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion('')).toEqual(getExpectedURL(US_SEARCH_URL))
  })

  it('returns the US base URL when an unsupported country code is provided (no accept-language header)', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion('not-a-real-code')).toEqual(
      getExpectedURL(US_SEARCH_URL)
    )
  })

  it('returns the Argentina base URL when the country code is AR (no accept-language header)', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion('AR')).toEqual(
      getExpectedURL('https://ar.search.yahoo.com')
    )
  })

  it('returns the Argentina base URL when the country code is lowercase ar (no accept-language header)', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion('ar')).toEqual(
      getExpectedURL('https://ar.search.yahoo.com')
    )
  })

  it('returns the Australia base URL when the country code is AU (no accept-language header)', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion('AU')).toEqual(
      getExpectedURL('https://au.search.yahoo.com')
    )
  })

  it('returns the Germany base URL when the country code is DE (no accept-language header)', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion('DE')).toEqual(
      getExpectedURL('https://de.search.yahoo.com')
    )
  })

  it('returns the Spain base URL when the country code is ES (no accept-language header)', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion('ES')).toEqual(
      getExpectedURL('https://es.search.yahoo.com')
    )
  })

  it('returns the Hong Kong base URL when the country code is HK (no accept-language header)', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion('HK')).toEqual(
      getExpectedURL('https://hk.search.yahoo.com')
    )
  })

  it('returns the United Kingdom base URL when the country code is UK (no accept-language header)', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion('UK')).toEqual(
      getExpectedURL('https://uk.search.yahoo.com')
    )
  })

  it('returns the United States base URL when the country code is US (no accept-language header)', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion('US')).toEqual(getExpectedURL(US_SEARCH_URL))
  })
})
