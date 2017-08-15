
import ReferralDataModel from './ReferralDataModel'

/**
 * Add a new referral data log to the DB.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The referred user id.
 * @param {string} referringUser - The referring user id.
 * @return {Promise<ReferralData>}  A promise that resolve into a referral data log.
 */
export default async (userContext, userId, referringUserId) => {
  return ReferralDataModel.create(userContext, {
    userId: userId,
    referringUser: referringUserId
  })
}
