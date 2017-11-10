/* eslint no-useless-escape: 0 */

import XRegExp from 'xregexp'
import localStorageMgr from './localstorage-mgr'

const referralParams = {
  REFERRING_USER: {
    urlKey: 'u',
    key: 'referringUser'
  }
}

// 'utm_medium'
// 'utm_source'
// 'utm_campaign'
// 'utm_term'
// 'utm_content'
// 'tfac_id'

// TODO: clean up validation and maybe move the functions
// into their respective components.

/**
 * Determine if a username string is valid.
 * @param {string} username - The username
 * @return {boolean} Whether the username is valid.
 */
function validateUsername (username) {
  if (username.length < 2) {
    return false
  }
  // Based on:
  // https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SignUp.html#CognitoUserPools-SignUp-request-Username
  var re = XRegExp('^[\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+$')
  return re.test(username)
}

/**
 * Determine if a email string is valid.
 * @param {string} email - The email
 * @return {boolean} Whether the email is valid.
 */
function validateEmail (email) {
  var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  return re.test(email)
}

function validateCode (code) {
  return (new RegExp('^\\d+$')).test(code)
}

/**
 * Determine if a password is valid.
 * @param {string} password - The password
 * @param {object} config - The requirements for the password
 * @param {boolean} config.lowercase - Whether the password must contain a
 *   lowercase letter.
 * @param {boolean} config.uppercase - Whether the password must contain a
 *   uppercase letter.
 * @param {boolean} config.number - Whether the password must contain a
 *   number.
 * @param {boolean} config.special - Whether the password must contain a
 *   special character.
 * @param {boolean} config.minSize - The minimum password length.
 * @returns {object} validation - Information on the password validity
 * @returns {boolean} validation.valid - Whether the passwrod is valid.
 * @returns {boolean} config.lowercase - Whether this field fails validation.
 * @returns {boolean} config.uppercase - Whether this field fails validation.
 * @returns {boolean} config.number - Whether this field fails validation.
 * @returns {boolean} config.special - Whether this field fails validation.
 * @returns {boolean} config.minSize - Whether this field fails validation.
*/
function validatePassword (password, config) {
  var regex = {
    lowercase: '^(?=.*[a-z])',
    uppercase: '^(?=.*[A-Z])',
    numeric: '^(?=.*[0-9])',
    special: '^(?=.*[!@#\$%\^&\*])'
  }

  if (config.minSize) {
    regex['minSize'] = '^(?=.{' + config.minSize + ',})'
  }

  const result = {
    valid: true
  }

  for (var prop in config) {
    if (config[prop] && regex[prop]) {
      result[prop] = (new RegExp(regex[prop])).test(password)
      if (!result[prop]) { result.valid = false }
    } else {
      result[prop] = true
    }
  }

  return result
}

function getUrlParameters () {
  var vars = {}
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value
    })
  return vars
}

function setReferralData (urlParams) {
  for (var fieldKey in referralParams) {
    var field = referralParams[fieldKey]
    if (urlParams[field.urlKey]) {
      localStorageMgr.setItem(field.key, urlParams[field.urlKey])
    }
  }
}

function getReferralData () {
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

function commaFormatted (amount) {
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

function currencyFormatted (amount) {
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

export {
 validateEmail,
 validatePassword,
 validateCode,
 getUrlParameters,
 getReferralData,
 setReferralData,
 commaFormatted,
 currencyFormatted,
 validateUsername
}
