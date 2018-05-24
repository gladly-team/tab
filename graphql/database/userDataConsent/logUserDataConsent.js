
import moment from 'moment'
import UserDataConsentModel from './UserDataConsentModel'
const ConsentString = require('consent-string').ConsentString

/**
 * Log user data consent (e.g. from GDPR) using the IAB standard consent string.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} consentStr - The IAB standard consent string (encoded).
 * @param {boolean} isGlobalConsent - Whether the user consent to all data use cases.
 * @return {Object} If successful, a single key ("success") with value `true`
 */
const logUserDataConsent = async (userContext, userId, consentStr, isGlobalConsent) => {
  // Decode the consent string.
  // https://github.com/InteractiveAdvertisingBureau/Consent-String-SDK-JS#documentation
  const ConsentData = new ConsentString(consentStr)

  try {
    await UserDataConsentModel.create(userContext, {
      userId: userId,
      timestamp: moment.utc().toISOString(),
      consentString: consentStr,
      consentCreated: moment(ConsentData.created).toISOString(),
      consentLastUpdated: moment(ConsentData.lastUpdated).toISOString(),
      version: ConsentData.getVersion(),
      vendorListVersion: ConsentData.getVendorListVersion(),
      cmpId: ConsentData.getCmpId(),
      cmpVersion: ConsentData.getCmpVersion(),
      consentScreen: ConsentData.getConsentScreen(),
      allowedPurposeIds: ConsentData.getPurposesAllowed(),
      allowedVendorIds: ConsentData.getVendorsAllowed(),
      isGlobalConsent: isGlobalConsent
    })
  } catch (e) {
    throw e
  }
  return { success: true }
}

export default logUserDataConsent
