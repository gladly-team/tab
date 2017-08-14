
import ReferralDataModel from './ReferralDataModel'
import {
  getPermissionsOverride
} from '../../utils/authorization-helpers'

/**
 * Add a new referral data log to the DB.
 * @param {string} userId - The referred user id.
 * @param {string} referringUser - The referring user id.
 * @return {Promise<ReferralData>}  A promise that resolve into a referral data log.
 */
export default async (userId, referringUserId) => {
  const permissionsOverride = getPermissionsOverride()
  return ReferralDataModel.create(permissionsOverride, {
    userId: userId,
    referringUser: referringUserId
  })
}
