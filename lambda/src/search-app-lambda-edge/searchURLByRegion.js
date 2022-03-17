// The URL path, which is unaffected by country/language.
// Add a "p" URL parameter value with search terms.
const urlPath = '/yhs/search?hspart=gladly&hsimp=yhs-001'

// The base URL is determined by country and language.
// Here, keys are ISO 3166-1 alpha-2 codes:
// https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
// Special cases (language) are listed outside of this object.
const baseURLMap = {
  // Argentina
  AR: 'https://ar.search.yahoo.com',
  // Austria
  AT: 'https://at.search.yahoo.com',
  // Australia
  AU: 'https://au.search.yahoo.com',
  // Brazil
  BR: 'https://br.search.yahoo.com',
  // Chile
  CL: 'https://cl.search.yahoo.com',
  // Colombia
  CO: 'https://co.search.yahoo.com',
  // Germany
  DE: 'https://de.search.yahoo.com',
  // Denmark
  DK: 'https://dk.search.yahoo.com',
  // Spain
  ES: 'https://es.search.yahoo.com',
  // Finland
  FI: 'https://fi.search.yahoo.com',
  // France
  FR: 'https://fr.search.yahoo.com',
  // Hong Kong
  HK: 'https://hk.search.yahoo.com',
  // Indonesia
  RI: 'https://id.search.yahoo.com',
  // India
  IN: 'https://in.search.yahoo.com',
  // Italy
  IT: 'https://it.search.yahoo.com',
  // Mexico
  MX: 'https://mx.search.yahoo.com',
  // Malaysia
  MY: 'https://malaysia.search.yahoo.com',
  // Netherlands
  NL: 'https://nl.search.yahoo.com',
  // Norway
  NO: 'https://no.search.yahoo.com',
  // New Zealand
  NZ: 'https://nz.search.yahoo.com',
  // Peru
  PE: 'https://pe.search.yahoo.com',
  // Philippines
  PH: 'https://ph.search.yahoo.com',
  // Sweden
  SE: 'https://se.search.yahoo.com',
  // Singapore
  SG: 'https://sg.search.yahoo.com',
  // Thailand
  TH: 'https://th.search.yahoo.com',
  // Taiwan
  TW: 'https://tw.search.yahoo.com',
  // United Kingdom
  UK: 'https://uk.search.yahoo.com',
  // United States
  US: 'https://search.yahoo.com',
  // Venezuela
  VE: 'https://ve.search.yahoo.com',
  // Viet Nam
  VN: 'https://vn.search.yahoo.com',
}

const CANADA_COUNTRY_CODE = 'CA'
const canadaBaseURLs = {
  // Canada - English
  en: 'https://ca.search.yahoo.com',
  // Canada - French
  fr: 'https://cf.search.yahoo.com',
}

const SWITZERLAND_COUNTRY_CODE = 'CH'
const switzerlandBaseURLs = {
  // Switzerland - German
  de: 'https://ch.search.yahoo.com',
  // Switzerland - French
  fr: 'https://chfr.search.yahoo.com',
  // Switzerland - Italian
  it: 'https://chit.search.yahoo.com',
}

// Language code: es
const espanolBaseURL = 'https://espanol.search.yahoo.com'

/**
 * Returns the search URL based on a user's country and language.
 * Here, we select based on the country from which the request originated,
 * using the Accept-Language header value for more information where needed
 * and/or supported.
 * @param {String|undefined} countryCode - An ISO 3166-1 alpha-2 code:
 *   https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
 * @param {String|undefined} acceptLanguageHeader - The value of the
 *   request's Accept-Language header:
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language#specification
 *   The official list of possible values are here:
 *   https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
 *   FYI, a registry tool:
 *   https://github.com/mattcg/language-subtag-registry
 * @return {Boolean} Whether the new URL is for another app
 */
const searchURLByRegion = (countryCode = '', acceptLanguageHeader = '') => {
  const US_COUNTRY_CODE = 'US'
  const FALLBACK_BASE_URL = baseURLMap[US_COUNTRY_CODE]
  const countryCodeCaps = countryCode.toUpperCase()

  // TODO
  let baseURL
  if (baseURLMap[countryCodeCaps]) {
    baseURL = baseURLMap[countryCodeCaps]
  } else {
    baseURL = FALLBACK_BASE_URL
  }
  return `${baseURL}${urlPath}`
}

export default searchURLByRegion
