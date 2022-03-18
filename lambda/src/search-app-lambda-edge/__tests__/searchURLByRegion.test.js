/* eslint-env jest */

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

  it('returns the Canada (English) base URL when the country code is CA (no accept-language header)', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion('CA')).toEqual(
      getExpectedURL('https://ca.search.yahoo.com')
    )
  })

  it('returns the Switzerland (German) base URL when the country code is CH (no accept-language header)', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    expect(searchURLByRegion('CH')).toEqual(
      getExpectedURL('https://ch.search.yahoo.com')
    )
  })

  it('returns the Canada (English) base URL when the country code is CA and has an English-preferred accept-language', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    const acceptLanguageVal = 'en-GB,en-US;q=0.9,fr-CA;q=0.7,en;q=0.8'
    expect(searchURLByRegion('CA', acceptLanguageVal)).toEqual(
      getExpectedURL('https://ca.search.yahoo.com')
    )
  })

  it('returns the Canada (French) base URL when the country code is CA and has an French-preferred accept-language', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    const acceptLanguageVal = 'es,fr;q=0.8,it;q=0.2'
    expect(searchURLByRegion('CA', acceptLanguageVal)).toEqual(
      getExpectedURL('https://cf.search.yahoo.com')
    )
  })

  it('returns the Canada (English) base URL when the country code is CA and has an English language, even if French is preferred', () => {
    // This test is for a limitation of our language parser.
    // https://github.com/opentable/accept-language-parser#parserpicksupportedlangugagesarray-acceptlanguageheader-options--
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    const acceptLanguageVal = 'fr-FR,en;q=0.8'
    expect(searchURLByRegion('CA', acceptLanguageVal)).toEqual(
      getExpectedURL('https://ca.search.yahoo.com')
    )
  })

  it('returns the Canada (English) base URL when the country code is CA and the accept-language header has no matches', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    const acceptLanguageVal = 'it,de;q=0.9'
    expect(searchURLByRegion('CA', acceptLanguageVal)).toEqual(
      getExpectedURL('https://ca.search.yahoo.com')
    )
  })

  it('returns the Switzerland (German) base URL when the country code is CH and has an German-preferred accept-language', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    const acceptLanguageVal = 'de,it;q=0.4'
    expect(searchURLByRegion('CH', acceptLanguageVal)).toEqual(
      getExpectedURL('https://ch.search.yahoo.com')
    )
  })

  it('returns the Switzerland (French) base URL when the country code is CH and has an French-preferred accept-language', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    const acceptLanguageVal = 'fr,en;q=0.8'
    expect(searchURLByRegion('CH', acceptLanguageVal)).toEqual(
      getExpectedURL('https://chfr.search.yahoo.com')
    )
  })

  it('returns the Switzerland (Italian) base URL when the country code is CH and has an Italian-preferred accept-language', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    const acceptLanguageVal = 'es,it;q=0.4,en;q=0.1'
    expect(searchURLByRegion('CH', acceptLanguageVal)).toEqual(
      getExpectedURL('https://chit.search.yahoo.com')
    )
  })

  it('returns the Switzerland (German) base URL when the country code is CH and the accept-language header has no matches', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    const acceptLanguageVal = 'es,es-MX'
    expect(searchURLByRegion('CH', acceptLanguageVal)).toEqual(
      getExpectedURL('https://ch.search.yahoo.com')
    )
  })

  it('returns an Espanol base URL if there is no country match and Spanish is an accepted language', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    const acceptLanguageVal = 'es,es-MX'
    const UNSUPPORTED_COUNTRY_CODE = 'CU'
    expect(
      searchURLByRegion(UNSUPPORTED_COUNTRY_CODE, acceptLanguageVal)
    ).toEqual(getExpectedURL('https://espanol.search.yahoo.com'))
  })

  it('returns the default base URL if there is no country match and Spanish is *not* an accepted language', () => {
    expect.assertions(1)
    const searchURLByRegion = require('../searchURLByRegion').default
    const acceptLanguageVal = 'fr,it'
    const UNSUPPORTED_COUNTRY_CODE = 'CU'
    expect(
      searchURLByRegion(UNSUPPORTED_COUNTRY_CODE, acceptLanguageVal)
    ).toEqual(getExpectedURL('https://search.yahoo.com'))
  })
})
