import localStorageManager from 'js/utils/localstorage-mgr'
import { STORAGE_NEW_CONSENT_DATA_EXISTS } from 'js/constants'
import logger from 'js/utils/logger'

/**
 * Get the vendor consent string from the consent management platform.
 * @return {Promise<string|null>} A promise that resolves into the
 *   consent string, or null if there was an error getting the string
 */
export const getConsentString = () => {
  return new Promise((resolve, reject) => {
    function cmpSuccessCallback(consentData) {
      if (!consentData) {
        resolve(null)
      }
      resolve(consentData.consentData)
    }

    // If the CMP throws any error, just return null.
    try {
      window.__cmp('getConsentData', null, cmpSuccessCallback)
    } catch (e) {
      logger.error(e)
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
    function cmpSuccessCallback(consentData) {
      if (!consentData) {
        resolve(null)
      }
      resolve(consentData.hasGlobalConsent)
    }

    // If the CMP throws any error, just return null.
    try {
      window.__cmp('getConsentData', null, cmpSuccessCallback)
    } catch (e) {
      logger.error(e)
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

// Our own storage of consent callback functions. We manage
// this ourselves because:
// 1) Quantcast Choice does not have a method to unregister
//   callbacks.
// 2) Quantcast Choice will only call the callback once,
//   so the handler would otherwise have to re-register the
//   callback if it wants to continue to be called, which is
//   not intuitive.
const consentCallbacks = []
var alreadyRegisteredCMPConsentCallback = false

/**
 * Make the CMP call all consent callbacks when the user
 * changes their consent options.
 */
const registerConsentChangeCallbacksWithCMP = async () => {
  const callCallbacksAndReRegister = async () => {
    // We should verify that consent data exists before acting
    // upon the callback.
    const consentString = await getConsentString()
    const isGlobalConsent = await hasGlobalConsent()
    if (consentString) {
      consentCallbacks.forEach(callback => {
        callback(consentString, isGlobalConsent)
      })
    }

    // Re-register the callback with Quantcast Choice so we can
    // handle any other consent changes on this same page view.
    // Quantcast Choice will not call this callback more than once.
    // "To invoke the callback every time the UI is shown, this
    // operation will need to be made before each time the UI is
    // brought up with __cmp('displayConsentUi')."
    // https://quantcast.zendesk.com/hc/en-us/articles/360003814853-Technical-Implementation-Guide
    registerConsentChangeCallbacksWithCMP()
  }

  // Note: this callback appears to be buggy as of 5/29/2018.
  // It's called every time the CMP loads, regardless of
  // whether in the EU or not. We can't rely on it calling
  // just once, nor can we rely on consent data existing.
  // We reached out to Quantcast about this.
  window.__cmp('setConsentUiCallback', callCallbacksAndReRegister)
}

/**
 * Register a callback that will be triggered when a user
 * changes their consent options (closes the consent UI).
 * @param {function} cb - The callback function
 * @return {undefined}
 */
export const registerConsentCallback = cb => {
  // If this is the first time we've registered a callback,
  // make sure our CMP will call all callbacks when the
  // consent data changes.
  if (!alreadyRegisteredCMPConsentCallback) {
    alreadyRegisteredCMPConsentCallback = true
    registerConsentChangeCallbacksWithCMP()
  }
  consentCallbacks.push(cb)
}

/**
 * Unregister a callback that was previously registered to
 * to be called when triggered when a user changes their
 * consent options.
 * @param {function} cb - The callback function
 * @return {undefined}
 */
export const unregisterConsentCallback = cb => {
  const cbIndex = consentCallbacks.indexOf(cb)
  if (cbIndex > -1) {
    consentCallbacks.splice(cbIndex, 1)
  }
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
