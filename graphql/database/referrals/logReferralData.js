import ReferralDataModel from './ReferralDataModel'

/**
 * Add a new referral data log to the DB.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The referred user id.
 * @param {string} referringUserId - The referring user id.
 * @param {string} referringChannelId - The referring channel id.
 * @return {Promise<ReferralData>}  A promise that resolve into a referral data log.
 */
export default async (
  userContext,
  userId,
  referringUserId,
  referringChannelId
) =>
  ReferralDataModel.create(userContext, {
    userId,
    referringUser: referringUserId,
    referringChannel: referringChannelId,
  })
