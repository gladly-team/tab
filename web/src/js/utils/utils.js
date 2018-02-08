/* eslint no-useless-escape: 0 */

import localStorageMgr from './localstorage-mgr'
import {
  STORAGE_REFERRAL_DATA_REFERRING_CHANNEL,
  STORAGE_REFERRAL_DATA_REFERRING_USER
} from '../constants'
import XRegExp from 'xregexp'

/**
 * Determine if a username string is valid.
 * @param {string} username - The username
 * @return {boolean} Whether the username is valid.
 */
export const validateUsername = (username) => {
  if (username.length < 2) {
    return false
  }
  // Based on:
  // https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SignUp.html#CognitoUserPools-SignUp-request-Username
  var re = XRegExp('^[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+$')
  return re.test(username)
}

// 'utm_medium'
// 'utm_source'
// 'utm_campaign'
// 'utm_term'
// 'utm_content'
// 'tfac_id'

export const getUrlParameters = () => {
  var vars = {}
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value
    })
  return vars
}

// BEGIN: referral data helpers

const referralParams = [
  {
    urlParam: 'u',
    fieldName: 'referringUser',
    storageKey: STORAGE_REFERRAL_DATA_REFERRING_USER
  },
  {
    urlParam: 'r',
    fieldName: 'referringChannel',
    storageKey: STORAGE_REFERRAL_DATA_REFERRING_CHANNEL
  }
]

export const setReferralData = (urlParams) => {
  referralParams.forEach((paramObj) => {
    if (urlParams[paramObj.urlParam]) {
      localStorageMgr.setItem(paramObj.storageKey, urlParams[paramObj.urlParam])
    }
  })
}

export const getReferralData = () => {
  const data = {}
  referralParams.forEach((paramObj) => {
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
export const commaFormatted = (amount) => {
  var delimiter = ',' // replace comma if desired
  amount = amount.toString()
  var i = amount
  var d = null
  if (amount.indexOf('.') > -1) {
    var a = amount.split('.', 2)
    d = a[1]
    i = parseInt(a[0])
  }
  if (isNaN(i)) { return '' }
  var minus = ''
  if (i < 0) { minus = '-' }
  i = Math.abs(i)
  var n = i.toString()
  a = []
  while (n.length > 3) {
    var nn = n.substr(n.length - 3)
    a.unshift(nn)
    n = n.substr(0, n.length - 3)
  }
  if (n.length > 0) { a.unshift(n) }
  n = a.join(delimiter)
  if (d === null) { amount = n } else if (d.length < 1) { amount = n } else { amount = n + '.' + d }
  amount = minus + amount
  return amount
}

/**
 * Takes a number or numerical string and returns a string with two decimal places.
 * @param {number|string} amount - A number or numerical string
 * @return {string} The amount with exactly two decimal places (rounded or appended)
 */
export const currencyFormatted = (amount) => {
  var i = parseFloat(amount)
  if (isNaN(i)) { i = 0.00 }
  var minus = ''
  if (i < 0) { minus = '-' }
  i = Math.abs(i)
  i = parseInt((i + 0.005) * 100)
  i = i / 100
  var s = i.toString()
  if (s.indexOf('.') < 0) { s += '.00' }
  if (s.indexOf('.') === (s.length - 2)) { s += '0' }
  s = minus + s
  return s
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
