/* eslint no-useless-escape: 0 */

import localStorageMgr from './localstorage-mgr'
import XRegExp from 'xregexp'

// TODO: use prefixed localStorage key
const referralParams = {
  REFERRING_USER: {
    urlKey: 'u',
    key: 'referringUser'
  }
}

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

export const setReferralData = (urlParams) => {
  for (var fieldKey in referralParams) {
    var field = referralParams[fieldKey]
    if (urlParams[field.urlKey]) {
      localStorageMgr.setItem(field.key, urlParams[field.urlKey])
    }
  }
}

export const getReferralData = () => {
  var data = null
  for (var fieldKey in referralParams) {
    var field = referralParams[fieldKey]
    var fieldData = localStorageMgr.getItem(field.key)
    if (fieldData) {
      if (!data) {
        data = {}
      }
      data[field.key] = fieldData
    }
  }
  return data
}

export const commaFormatted = (amount) => {
  var delimiter = ',' // replace comma if desired
  amount = amount.toString()
  var a = amount.split('.', 2)
  var d = a[1]
  var i = parseInt(a[0])
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
