
import localStorageManager from 'utils/localstorage-mgr'
import {
  STORAGE_NEW_CONSENT_DATA_EXISTS,
  STORAGE_CONSENT_DATA_LOG_IN_PROGRESS
} from '../constants'

/**
 * Get the vendor consent string from the consent management platform.
 * @return {Promise<string|null>} A promise that resolves into the
 *   consent string, or null if there was an error getting the string
 */
export const getConsentString = () => {
  return new Promise((resolve, reject) => {
    function cmpSuccessCallback (consentData) {
      if (!consentData) {
        resolve(null)
      }
      resolve(consentData.consentData)
    }

    // If the CMP throws any error, just return null.
    try {
      window.__cmp('getConsentData', null, cmpSuccessCallback)
    } catch (e) {
      console.error(e)
      resolve(null)
    }
  })
}

/**
 * Get whether the user has provided global consent for all uses.
 * @return {Promise<boolean|null>} A promise that resolves into a
 *   boolean, or null if there was an error getting the data
 */
export const hasGlobalConsent = () => {
  return new Promise((resolve, reject) => {
    function cmpSuccessCallback (consentData) {
      if (!consentData) {
        resolve(null)
      }
      resolve(consentData.hasGlobalConsent)
    }

    // If the CMP throws any error, just return null.
    try {
      window.__cmp('getConsentData', null, cmpSuccessCallback)
    } catch (e) {
      console.error(e)
      resolve(null)
    }
  })
}

/**
 * Call the CMP to display the consent UI.
 * @return {undefined}
 */
export const displayConsentUI = () => {
  window.__cmp('displayConsentUi')
}

/**
 * Register a callback that will be triggered when a user
 * makes a choice in the consent UI.
 * @param {function} cb - The callback function
 * @return {Promise<undefined>}
 */
export const registerConsentCallback = async (cb) => {
  // Note: this callback appears to be buggy as of 5/24/2018
  // and is called every time the CMP loads outside of the EU.
  // We should verify that consent data exists before acting
  // upon the callback.
  window.__cmp('setConsentUiCallback', async () => {
    const consentString = await getConsentString()
    const isGlobalConsent = await hasGlobalConsent()
    if (consentString) {
      cb(consentString, isGlobalConsent)
    }
  })
}

/**
 * Save a flag in localStorage so that the app knows consent
 * has changed and we need to log updated data to the server.
 * We do this because consent updating may happen when the user
 * is not authenticated. Do not save anything if a consent data
 * is pending (currently in process).
 * @return {undefined}
 */
export const saveConsentUpdateEventToLocalStorage = () => {
  localStorageManager.setItem(STORAGE_NEW_CONSENT_DATA_EXISTS, 'true')
}

/**
 * Determine if we have pending (updated) consent data that we
 * have not yet logged to the server. We may log more than once per
 * updated consent (e.g multiple opened tabs), but that's acceptable.
 * @return {boolean} Whether we need to log new consent data
 */
export const checkIfNewConsentNeedsToBeLogged = () => {
  return localStorageManager.getItem(STORAGE_NEW_CONSENT_DATA_EXISTS) === 'true'
}

/**
 * Mark that we've successfully logged the latest consent data
 * to the server.
 * @return {undefined}
 */
export const markConsentDataAsLogged = () => {
  localStorageManager.removeItem(STORAGE_NEW_CONSENT_DATA_EXISTS)
}
