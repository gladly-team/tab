
import moment from 'moment'
import VCDonationModel from './VCDonationModel'
import UserModel from '../users/UserModel'
import addVcDonatedAllTime from '../users/addVcDonatedAllTime'

/**
 * Donate the user's virtal currency to the specified charity.
 * Deduct the VC from the user's balance and create a VCDonation log.
 * @param {object} userContext - The user authorizer object.
 * @param {string} id - The user id.
 * @param {string} charityId - The charity id.
 * @param {integer} vc - The amount of virtual currency to add to the
 *   user's balance.
 * @return {Promise<Object>} A promise that resolves into an object
 *   containing 'user' and 'error' keys
 */
export default async (userContext, userId, charityId, vc) => {
  try {
    // Subtract current VC from the user.
    // Only allow the update if the user has more VC
    // than they are attempting to donate.
    try {
      const params = {}
      params.ConditionExpression = '#vcCurrent >= :vcToDonate'
      params.ExpressionAttributeNames = { '#vcCurrent': 'vcCurrent' }
      params.ExpressionAttributeValues = {':vcToDonate': vc}
      await UserModel.update(userContext, {
        id: userId,
        vcCurrent: {$add: -vc}
      }, params)
    } catch (e) {
      // The user did not have sufficient VC.
      if (e.code === 'ConditionalCheckFailedException') {
        return {
          user: null,
          errors: [{
            code: 'VC_INSUFFICIENT_TO_DONATE',
            message: `The user did not have the required ${vc} VC`
          }]
        }
      } else {
        throw e
      }
    }

    // Create the VC donation.
    await VCDonationModel.create(userContext, {
      userId: userId,
      timestamp: moment.utc().toISOString(),
      charityId: charityId,
      vcDonated: vc
    })

    // Add VC donated to the user's all time count.
    const user = await addVcDonatedAllTime(userContext, userId, vc)

    return {
      user: user,
      errors: null
    }
  } catch (e) {
    throw e
  }
}
