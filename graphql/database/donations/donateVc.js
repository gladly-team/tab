import moment from 'moment'
import VCDonationModel from './VCDonationModel'
import VCDonationByCharityModel from './VCDonationByCharityModel'
import UserModel from '../users/UserModel'
import addVcDonatedAllTime from '../users/addVcDonatedAllTime'
import { DatabaseConditionalCheckFailedException } from '../../utils/exceptions'
import {
  getPermissionsOverride,
  ADD_VC_DONATED_BY_CHARITY,
} from '../../utils/permissions-overrides'

const addVCDonatedByCharityOverride = getPermissionsOverride(
  ADD_VC_DONATED_BY_CHARITY
)

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
      params.ExpressionAttributeValues = { ':vcToDonate': vc }
      await UserModel.update(
        userContext,
        {
          id: userId,
          vcCurrent: { $add: -vc },
        },
        params
      )
    } catch (e) {
      // The user did not have sufficient VC.
      if (e.code === DatabaseConditionalCheckFailedException.code) {
        return {
          user: null,
          errors: [
            {
              code: 'VC_INSUFFICIENT_TO_DONATE',
              message: `The user did not have the required ${vc} VC`,
            },
          ],
        }
      }
      throw e
    }

    // Create the VC donation.
    await VCDonationModel.create(userContext, {
      userId,
      timestamp: moment.utc().toISOString(),
      charityId,
      vcDonated: vc,
    })

    // Add VC donated to the user's all time count.
    const user = await addVcDonatedAllTime(userContext, userId, vc)

    // Update or create the VC donations by hour for this charity.
    // First, try to update it, and then create the item if it does
    // not yet exist.
    try {
      await VCDonationByCharityModel.update(addVCDonatedByCharityOverride, {
        charityId,
        // The datetime of the start of this hour.
        timestamp: moment
          .utc()
          .startOf('hour')
          .toISOString(),
        vcDonated: { $add: vc },
      })
    } catch (e) {
      // The item does not exist, so create it.
      if (e.code === DatabaseConditionalCheckFailedException.code) {
        try {
          await VCDonationByCharityModel.create(addVCDonatedByCharityOverride, {
            charityId,
            // The datetime of the start of this hour.
            timestamp: moment
              .utc()
              .startOf('hour')
              .toISOString(),
            vcDonated: vc,
          })
        } catch (err) {
          throw err
        }
      } else {
        throw e
      }
    }

    return {
      user,
      errors: null,
    }
  } catch (e) {
    throw e
  }
}
