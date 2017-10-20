
import {
  USER_REFERRAL_VC_REWARD
} from '../constants'
import {
  getPermissionsOverride,
  REWARD_REFERRER_OVERRIDE
} from '../../utils/permissions-overrides'
import addVc from './addVc'
import addUsersRecruited from './addUsersRecruited'
const override = getPermissionsOverride(REWARD_REFERRER_OVERRIDE)

/**
 * Reward a referring user by increasing their VC and adding to
 * their count of recruited users.
 * @param {string} referringUserId - The ID of the referring user.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const rewardReferringUser = async (referringUserId) => {
  try {
    await addVc(override, referringUserId,
      USER_REFERRAL_VC_REWARD)
    await addUsersRecruited(referringUserId, 1)
  } catch (e) {
    throw e
  }
}

export default rewardReferringUser
