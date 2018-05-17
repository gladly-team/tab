import Raven from 'raven-js'
import moment from 'moment'
import localStorageMgr from 'utils/localstorage-mgr'
import {
  STORAGE_LOCATION_COUNTRY_ISO_CODE,
  STORAGE_LOCATION_IS_IN_EU,
  STORAGE_LOCATION_QUERY_TIME
} from '../constants'
import { isNil } from 'lodash/lang'

// Get the client location with a country-level granularity.
// This expects that the MaxMind script already created the
// `window.geoip2` object.

// Store location in memory to avoid unnecessary queries.
// This will be an instance of ClientLocation.
var location = null

// To store in-progress fetches so we don't fetch location
// more than once.
var locationFetchPromise = null

function ClientLocation (countryIsoCode, isInEuropeanUnion, queryTime) {
  this.countryIsoCode = countryIsoCode
  this.isInEuropeanUnion = isInEuropeanUnion

  // An ISO string
  this.queryTime = queryTime
}

/**
 * Call MaxMind for location data and return a ClientLocation object.
 * @return {ClientLocation} The location object
 */
const getLocationFromMaxMind = () => {
  // MaxMind response structure. See:
  // https://dev.maxmind.com/geoip/geoip2/web-services/
  // The key "country.is_in_european_union" will be true if the country
  // is in EU. Otherwise, it will be undefined.
  // {
  //   "continent": {
  //     "code": "NA",
  //     "geoname_id": 6255149,
  //     "names": {
  //       "en": "North America"
  //       ...
  //     }
  //   },
  //   "country": {
  //     "iso_code": "US",
  //     "geoname_id": 6252001,
  //     "names": {
  //       "en": "United States",
  //       ...
  //     }
  //   },
  //   "registered_country": {
  //     "iso_code": "US",
  //     "geoname_id": 6252001,
  //     "names": {
  //       "en": "United States",
  //       ...
  //     }
  //   },
  //   "traits": {
  //     "ip_address": "73.xxx.xxx.x"
  //   }
  // }

  // If a fetch is in progress, return that promise
  // so we don't fetch location more than once.
  if (locationFetchPromise) {
    return locationFetchPromise
  }

  locationFetchPromise = new Promise((resolve, reject) => {
    // https://dev.maxmind.com/geoip/geoip2/javascript/
    // TODO: decide how to handle errors
    try {
      window.geoip2.country(
        (data) => {
          // console.log('Success! Got data:', data)
          const isInEuropeanUnion = data.country.is_in_european_union === true
          resolve(new ClientLocation(
            data.country.iso_code,
            isInEuropeanUnion,
            moment.utc().toISOString()))
        },
        (error) => {
          console.error(error)
          reject(error)
        }
      )
    } catch (e) {
      // Log a subset of errors that we care about to Sentry.
      if ([
        'QUERY_FORBIDDEN',
        'OUT_OF_QUERIES',
        'PERMISSION_REQUIRED'
      ].indexOf(e.code) > -1) {
        Raven.captureException(e)
      }
      reject(e)
    }
  })
  return locationFetchPromise
}

/**
 * Try to get location data from localStorage. If it exists and hasn't
 * expired, return a ClientLocation object; else return null.
 * @return {ClientLocation|null} The location object, or null if no
 *   unexpired location exists in localStorage.
 */
const getLocationFromLocalStorage = () => {
  const countryCode = localStorageMgr.getItem(STORAGE_LOCATION_COUNTRY_ISO_CODE)
  const isInEuropeanUnionStr = localStorageMgr.getItem(STORAGE_LOCATION_IS_IN_EU)
  const queryTimeISO = localStorageMgr.getItem(STORAGE_LOCATION_QUERY_TIME)
  const queryTime = moment(queryTimeISO)
  const isInEuropeanUnion = localStorageMgr.getItem(STORAGE_LOCATION_IS_IN_EU) === 'true'

  // If the location data does not exist, return null.
  const isDataValid = (
    !isNil(countryCode) &&
    !isNil(isInEuropeanUnionStr) &&
    !isNil(queryTime) &&
    queryTime.isValid()
  )
  if (!isDataValid) {
    return null
  }

  // If the location data is too old, return null.
  const now = moment().utc()
  const daysSinceLocationQuery = now.diff(queryTime, 'days')
  const LOCATION_EXPIRE_DAYS = 60
  if (daysSinceLocationQuery > LOCATION_EXPIRE_DAYS) {
    return null
  }

  return new ClientLocation(countryCode, isInEuropeanUnion, queryTime)
}

/**
 * Store the location data in localStorage.
 * @param {ClientLocation} location - The ClientLocation object
 * @return {undefined}
 */
const setLocationInLocalStorage = (location) => {
  localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, location.countryIsoCode)
  localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, location.isInEuropeanUnion.toString())
  localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, location.queryTime)
}

/**
 * Return client's location. Try to get the location data from memory;
 * fall back to localStorage; then fall back to querying MaxMind for
 * new location data.
 * @return {Promise<ClientLocation>} The client's location
 */
const getLocation = async () => {
  // Only fetch location if we haven't already.
  if (!location) {
    // Try to get the location data from localStorage.
    const locationLocalStorage = getLocationFromLocalStorage()
    if (locationLocalStorage) {
      location = locationLocalStorage
    // If location isn't in localStorage, query for it.
    } else {
      location = await getLocationFromMaxMind()
      setLocationInLocalStorage(location)
    }
  }
  return location
}

/**
 * Return the ISO 3166-1 country code of the country the client is in.
 * See ISO codes: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
 * @return {Promise<string>} The two-character ISO 3166-1 country code
 */
export const getCountry = async () => {
  const clientLocation = await getLocation()
  return clientLocation.countryIsoCode
}

/**
 * Return whether the client is in the European Union.
 * @return {Promise<Boolean>} Whether or not the client is in the EU
 */
export const isInEuropeanUnion = async () => {
  const clientLocation = await getLocation()
  return clientLocation.isInEuropeanUnion
}
