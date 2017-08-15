
import {
  USER_REFERRAL_VC_REWARD
} from '../constants'
import {
  getPermissionsOverride,
  REWARD_REFERRER_OVERRIDE
} from '../../utils/permissions-overrides'
import addVc from './addVc'
const override = getPermissionsOverride(REWARD_REFERRER_OVERRIDE)

/**
 * Reward a referring user by increasing their VC.
 * @param {string} referringUserId - The ID of the referring user.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const rewardReferringUser = async (referringUserId) => {
  await addVc(override, referringUserId,
    USER_REFERRAL_VC_REWARD)
}

export default rewardReferringUser
