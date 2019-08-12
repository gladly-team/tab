/* eslint no-useless-escape: 0 */

import localStorageMgr from 'js/utils/localstorage-mgr'
import {
  STORAGE_REFERRAL_DATA_REFERRING_CHANNEL,
  STORAGE_REFERRAL_DATA_REFERRING_USER,
  SEARCH_APP,
  TAB_APP,
} from 'js/constants'
import qs from 'qs'

/**
 * Determine if a username string is valid.
 * @param {string} username - The username
 * @return {boolean} Whether the username is valid.
 */
export const validateUsername = username => {
  if (username.length < 2) {
    return {
      isValid: false,
      reason: 'TOO_SHORT',
    }
  }
  // This validation rule added 2019 June 7.
  if (username.indexOf('@') > -1) {
    return {
      isValid: false,
      reason: 'NO_AT_SIGN',
    }
  }
  // This validation rule added 2019 June 7.
  if (username.indexOf(' ') > -1) {
    return {
      isValid: false,
      reason: 'NO_SPACES',
    }
  }
  return {
    isValid: true,
    reason: 'NONE',
  }
}

// Note: in general, we should probably use react-router's
// location object to get the search value.
export const getUrlParameters = () => {
  return parseUrlSearchString(window.location.search)
}

/**
 * Convert a string of URL parameters into an object.
 * @param {String} searchString - The URL parameter string,
 *   such as '?myParam=foo&another=bar'
 * @return {Object} The parsed parameter data
 */
export const parseUrlSearchString = searchString => {
  return qs.parse(searchString, { ignoreQueryPrefix: true })
}

// BEGIN: referral data helpers

const referralParams = [
  {
    urlParam: 'u',
    fieldName: 'referringUser',
    storageKey: STORAGE_REFERRAL_DATA_REFERRING_USER,
  },
  {
    urlParam: 'r',
    fieldName: 'referringChannel',
    storageKey: STORAGE_REFERRAL_DATA_REFERRING_CHANNEL,
  },
]

export const setReferralData = urlParams => {
  referralParams.forEach(paramObj => {
    if (urlParams[paramObj.urlParam]) {
      localStorageMgr.setItem(paramObj.storageKey, urlParams[paramObj.urlParam])
    }
  })
}

export const getReferralData = () => {
  const data = {}
  referralParams.forEach(paramObj => {
    var fieldData = localStorageMgr.getItem(paramObj.storageKey)
    if (fieldData) {
      data[paramObj.fieldName] = fieldData
    }
  })
  return data
}

// END: referral data helpers

// BEGIN: number helpers

/**
 * Takes a number or numerical string and returns a string with commas
 * between each pair of three non-fractional digits.
 * @param {number|string} amount - A number or numerical string
 * @return {string} The amount with commas where appropriate
 */
export const commaFormatted = amount => {
  if (amount === undefined || amount === null) {
    return '0'
  }
  var delimiter = ',' // replace comma if desired
  amount = amount.toString()
  var i = amount
  var d = null
  if (amount.indexOf('.') > -1) {
    var a = amount.split('.', 2)
    d = a[1]
    i = parseInt(a[0])
  }
  if (isNaN(i)) {
    return ''
  }
  var minus = ''
  if (i < 0) {
    minus = '-'
  }
  i = Math.abs(i)
  var n = i.toString()
  a = []
  while (n.length > 3) {
    var nn = n.substr(n.length - 3)
    a.unshift(nn)
    n = n.substr(0, n.length - 3)
  }
  if (n.length > 0) {
    a.unshift(n)
  }
  n = a.join(delimiter)
  if (d === null) {
    amount = n
  } else if (d.length < 1) {
    amount = n
  } else {
    amount = n + '.' + d
  }
  amount = minus + amount
  return amount
}

/**
 * Takes a number or numerical string and returns a string with two decimal places.
 * @param {number|string} amount - A number or numerical string
 * @return {string} The amount with exactly two decimal places (rounded or appended)
 */
export const currencyFormatted = amount => {
  if (amount === undefined || amount === null) {
    return '0.00'
  }
  var i = parseFloat(amount)
  if (isNaN(i)) {
    i = 0.0
  }
  var minus = ''
  if (i < 0) {
    minus = '-'
  }
  i = Math.abs(i)
  i = parseInt((i + 0.005) * 100)
  i = i / 100
  var s = i.toString()
  if (s.indexOf('.') < 0) {
    s += '.00'
  }
  if (s.indexOf('.') === s.length - 2) {
    s += '0'
  }
  s = minus + s
  return s
}

/**
 * Abbreviate a number to a string with a power suffix (e.g. 248345 to 248.3K)
 * @param {number} num - A number
 * @param {number} decimalPlaces - The maximum number of decimal places to show
 * @return {string} The abbreviated number
 */
export const abbreviateNumber = (num, decimalPlaces = 1) => {
  // From: https://stackoverflow.com/a/32638472/1332513
  // Alternative, more flexible library if needed:
  //   http://numeraljs.com/
  if (num === undefined || num === null || num === 0) {
    return '0'
  }
  decimalPlaces = !decimalPlaces || decimalPlaces < 0 ? 0 : decimalPlaces
  const b = num.toPrecision(2).split('e')
  const k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3)
  const c =
    k < 1
      ? num.toFixed(0 + decimalPlaces)
      : (num / Math.pow(10, k * 3)).toFixed(decimalPlaces)
  const d = c < 0 ? c : Math.abs(c)
  const e = d + ['', 'K', 'M', 'B', 'T'][k]
  return e
}
// END: number helpers

/**
 * Determine if the page is currently iframed.
 * @return {boolean} Whether the page is in an iframe.
 */
export const isInIframe = () => {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

/**
 * Get an of domain names we use for production.
 * @return {Array[String]} A list of domain names we use
 *  for our app on production.
 */
export const getProductionDomainNames = () => {
  return ['tab.gladly.io']
}

/**
 * Get an of domain names we use for development and testing.
 * @return {Array[String]} A list of domain names we use
 *  for our app in development and testing stages.
 */
export const getDevelopmentDomainNames = () => {
  return ['test-tab2017.gladly.io', 'dev-tab2017.gladly.io']
}

/**
 * Get an of domain names we use for local development.
 * @return {Array[String]} A list of domain names we use
 *  for our app in local development.
 */
export const getLocalDevelopmentDomainNames = () => {
  return ['localhost:3000', 'local-dev-tab.gladly.io:3000']
}

export const getAllDomainNames = () => {
  return []
    .concat(getLocalDevelopmentDomainNames())
    .concat(getDevelopmentDomainNames())
    .concat(getProductionDomainNames())
}

/**
 * Add a "cancel" method to a Promise. See:
 * https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
 * https://github.com/facebook/react/issues/5465#issuecomment-157888325
 * @param {Promise}
 * @return {Object} An object containing a promise and cancel method.
 */
export const makePromiseCancelable = promise => {
  let hasCanceled_ = false
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
    )
  })
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true
    },
  }
}

/**
 * Get the "window.tabforacause" global variable.
 * Used for handling some communication between disparate parts
 * of our app (e.g. ads events happening before app code loads).
 * @return {Object}
 */
export const getTabGlobal = () => {
  const tabforacause = window.tabforacause || {
    ads: {
      // Bid objects returned from apstag
      // Key: slot ID
      // Value: bid object
      amazonBids: {},

      // Bids returned from Index Exchange.
      // Key: slot element ID
      // Value: bid object
      indexExchangeBids: {
        // Whether the bids were returned in time to be part
        // of the request to our ad server.
        includedInAdServerRequest: false,
      },

      // Objects from googletag's "slotRenderEnded" event. This event fires
      // before the "slotOnload" event; i.e., before the actual creative loads.
      // Key: slot ID
      // Value: https://developers.google.com/doubleclick-gpt/reference#googletageventsslotrenderendedevent
      slotsRendered: {},

      // Marking which slots have fired googletag's "impressionViewable" event.
      // See:
      // https://developers.google.com/doubleclick-gpt/reference#googletageventsimpressionviewableevent
      // Key: slot ID
      // Value: `true`
      slotsViewable: {},

      // Marking which slots have fired googletag's "slotOnload" event;
      // i.e., which slots have loaded creative. See:
      // https://developers.google.com/doubleclick-gpt/reference#googletag.events.SlotRenderEndedEvent
      // Key: slot ID
      // Value: `true`
      slotsLoaded: {},

      // Marking which slots have had their revenue logged.
      // Key: slot ID
      // Value: `true`
      slotsAlreadyLoggedRevenue: {},
    },
    featureFlags: {},
  }
  // We're not running in global scope, so make sure to
  // assign to the window.
  if (!window.tabforacause) {
    window.tabforacause = tabforacause
  }
  return tabforacause
}

/**
 * Return the app name if it's valid or return the Tab for a Caise
 * app name ("tab") as a fallback.
 * @param {String} appName -
 * @return {String} The value of appName, if it is one of our apps,
 *   or "tab".
 */
export const validateAppName = appName => {
  return [TAB_APP, SEARCH_APP].indexOf(appName) > -1 ? appName : TAB_APP
}
