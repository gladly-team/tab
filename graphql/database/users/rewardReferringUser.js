
import {
  USER_REFERRAL_VC_REWARD
} from '../constants'
import {
  getPermissionsOverride
} from '../../utils/authorization-helpers'
import addVc from './addVc'

/**
 * Reward a referring user by increasing their VC.
 * @param {string} referringUserId - The ID of the referring user.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const rewardReferringUser = async (referringUserId) => {
  const permissionsOverride = getPermissionsOverride()
  await addVc(permissionsOverride, referringUserId,
    USER_REFERRAL_VC_REWARD)
}

export default rewardReferringUser
