
import VCDonationModel from './VCDonationModel'
import addVc from '../users/addVc'

/**
 * Donate the user's virtal currency to the specified charity.
 * Deduct the VC from the user's balance and create a VCDonation log.
 * @param {object} userContext - The user authorizer object.
 * @param {string} id - The user id.
 * @param {string} charityId - The charity id.
 * @param {integer} vc - The amount of virtual currency to add to the
 *   user's balance.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
export default async (userContext, userId, charityId, vc) => {
  try {
    const user = await addVc(userContext, userId, -vc)
    await VCDonationModel.create(userContext, {
      userId: userId,
      charityId: charityId,
      vcDonated: vc
    })
    return user
  } catch (e) {
    throw e
  }
}
