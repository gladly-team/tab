
/**
 * Get the vendor consent string from the consent management platform.
 * @return {Promise<string|null>} A promise that resolves into the
 *   consent string, or null if there was an error getting the string
 */
export const getConsentString = () => {
  return new Promise((resolve, reject) => {
    function cmpSuccessCallback (vendorConsents) {
      if (!vendorConsents) {
        resolve(null)
      }
      resolve(vendorConsents.metadata)
    }

    // If the CMP throws any error, just return null.
    try {
      window.__cmp('getVendorConsents', null, cmpSuccessCallback)
    } catch (e) {
      console.error(e)
      resolve(null)
    }
  })
}
