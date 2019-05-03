import moment from 'moment'
import ReferralLinkClickLogModel from './ReferralLinkClickLogModel'

/**
 * Log a user's click on their referral link, presumably to copy
 * it and share it with somebody.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<Object>} A promise that resolves into an object
 *   with a "success" boolean property.
 */
const logReferralLinkClick = async (userContext, userId) => {
  try {
    await ReferralLinkClickLogModel.create(userContext, {
      userId,
      timestamp: moment.utc().toISOString(),
    })
  } catch (e) {
    throw e
  }
  return { success: true }
}

export default logReferralLinkClick
