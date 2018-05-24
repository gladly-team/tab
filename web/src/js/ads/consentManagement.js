
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
 * @return {undefined}
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
