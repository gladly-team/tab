import moment from 'moment'
import localStorageMgr from 'js/utils/localstorage-mgr'
import {
  STORAGE_LOCATION_COUNTRY_ISO_CODE,
  STORAGE_LOCATION_IS_IN_EU,
  STORAGE_LOCATION_QUERY_TIME
} from 'js/constants'
import { isNil } from 'lodash/lang'
import logger from 'js/utils/logger'

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
 * Whether a MaxMind error concerns us enough to log.
 * @param {Object} err - The MaxMind error object
 * @return {Boolean} Whether we should log the MaxMind error
 */
const shouldLogMaxMindError = err => {
  return [
    'QUERY_FORBIDDEN',
    'OUT_OF_QUERIES',
    'PERMISSION_REQUIRED'
  ].indexOf(err.code) > -1
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

  // Store the promise so subsequent requests can use it
  // if this request is still in progress.
  locationFetchPromise = new Promise((resolve, reject) => {
    // https://dev.maxmind.com/geoip/geoip2/javascript/
    try {
      window.geoip2.country(
        (data) => {
          const isInEuropeanUnion = data.country.is_in_european_union === true
          resolve(new ClientLocation(
            data.country.iso_code,
            isInEuropeanUnion,
            moment.utc().toISOString()))
        },
        err => {
          // Log a subset of errors that we care about to Sentry.
          if (shouldLogMaxMindError(err)) {
            logger.error(err)
          }
          reject(err)
        }
      )
    } catch (err) {
      // Log a subset of errors that we care about to Sentry.
      if (shouldLogMaxMindError(err)) {
        logger.error(err)
      }
      reject(err)
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
 * new location data. Throw an error if we cannot determine location.
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
      // Throw an error if MaxMind cannot determine the location.
      var maxMindLocation = null
      try {
        maxMindLocation = await getLocationFromMaxMind()
      } catch (e) {
        throw new Error('Could not determine location.')
      }
      if (!maxMindLocation) {
        throw new Error('Could not determine location.')
      }

      // Save the location to localStorage and return it.
      location = maxMindLocation
      setLocationInLocalStorage(location)
    }
  }
  return location
}

/**
 * Return the ISO 3166-1 country code of the country the client is in.
 * Throw an error if we could not determine the country.
 * See ISO codes: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
 * @return {Promise<string>} The two-character ISO 3166-1 country code
 */
export const getCountry = async () => {
  try {
    const clientLocation = await getLocation()
    return clientLocation.countryIsoCode
  } catch (e) {
    throw new Error('Could not determine client location country.')
  }
}

/**
 * Return whether the client is in the European Union.
 * Throw an error if we could not determine the country.
 * @return {Promise<Boolean>} Whether or not the client is in the EU
 */
export const isInEuropeanUnion = async () => {
  try {
    const clientLocation = await getLocation()
    return clientLocation.isInEuropeanUnion
  } catch (e) {
    throw new Error('Could not determine client location EU membership.')
  }
}
