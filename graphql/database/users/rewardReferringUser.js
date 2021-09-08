import moment from 'moment'
import ReferralDataModel from '../referrals/ReferralDataModel'
import UserModel from './UserModel'
import UserImpactModel from '../userImpact/UserImpactModel'
import {
  USER_REFERRAL_VC_REWARD,
  CATS_CHARITY_ID,
  USER_IMPACT_REFERRAL_BONUS,
} from '../constants'
import {
  getPermissionsOverride,
  REWARD_REFERRER_OVERRIDE,
} from '../../utils/permissions-overrides'
import addVc from './addVc'
import addUsersRecruited from './addUsersRecruited'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'

const override = getPermissionsOverride(REWARD_REFERRER_OVERRIDE)

/**
 * Reward a referring user by increasing their VC and adding to
 * their count of recruited users. Only do this if the referring
 * user exists and has not already been rewarded. Important: this
 * function must be idempotent because it could be called more
 * than once.
 * @param {object} userContext - The user authorizer object.
 * @param {string} id - The user ID of the user whose referrer we
 *   should reward.
 * @return {Promise<Boolean>} A Promise that resolves into a
 *   boolean: true if we rewarded a referring user, false
 *   otherwise.
 */
const rewardReferringUser = async (
  userContext,
  userId,
  currentMissionId = false
) => {
  // If the user does not have a referring user, return.
  let referringUserId
  try {
    const referralData = await ReferralDataModel.get(userContext, userId)
    if (referralData.referringUser) {
      referringUserId = referralData.referringUser
    } else {
      return false
    }
  } catch (e) {
    // Referral data may not exist.
    if (e.code === DatabaseItemDoesNotExistException.code) {
      return false
    }
    throw e
  }

  // If the referring user has already been rewarded, return.
  try {
    const referredUser = await UserModel.get(userContext, userId)

    // Before we started logging email verification, we rewarded
    // referrers when users signed up. Now, it's possible we will
    // log email verification for existing users when they sign
    // back in. We don't want to reward referrers more than once,
    // so we'll just ignore users who signed up before the feature
    // change. We can remove this if we backfill the "emailVerified"
    // value for all users.
    const emailVerifyRewardChangeTime = moment('2018-09-14T20:00:00.000Z')
    const userJoinedBeforeFeature =
      !referredUser.joined ||
      !moment(referredUser.joined).isValid() ||
      moment(referredUser.joined).isBefore(emailVerifyRewardChangeTime)

    if (referredUser.referrerRewarded || userJoinedBeforeFeature) {
      return false
    }
  } catch (e) {
    throw e
  }

  // Mark that the referring user has been rewarded.
  try {
    await UserModel.update(userContext, {
      id: userId,
      referrerRewarded: true,
    })
  } catch (e) {
    throw e
  }
  // if user is on v4 and is not in a mission, altruistically reward both the referring user and referred user in UserImpact
  try {
    // also if user is not part of a squad invite
    if (!currentMissionId) {
      // get Referring User Impact
      const userImpactRecordReferringUser = await UserImpactModel.get(
        override,
        referringUserId,
        CATS_CHARITY_ID
      )
      const {
        pendingUserReferralImpact: pendingUserReferralImpactReferringUser,
        pendingUserReferralCount: pendingUserReferralCountReferringUser,
      } = userImpactRecordReferringUser

      // get Referred User Impact
      const userImpactRecordReferredUser = (await UserImpactModel.getOrCreate(
        override,
        {
          userId,
          charityId: CATS_CHARITY_ID,
        }
      )).item
      const {
        pendingUserReferralImpact: pendingUserReferralImpactReferredUser,
      } = userImpactRecordReferredUser

      // reward both Reffering and Referred users
      await Promise.all([
        UserImpactModel.update(override, {
          ...userImpactRecordReferringUser,
          pendingUserReferralImpact:
            pendingUserReferralImpactReferringUser + USER_IMPACT_REFERRAL_BONUS,
          pendingUserReferralCount: pendingUserReferralCountReferringUser + 1,
        }),
        UserImpactModel.update(override, {
          ...userImpactRecordReferredUser,
          pendingUserReferralImpact:
            pendingUserReferralImpactReferredUser + USER_IMPACT_REFERRAL_BONUS,
        }),
      ])
    }
  } catch (e) {
    if (!(e instanceof DatabaseItemDoesNotExistException)) {
      throw e
    }
  }
  // Reward the referring user.
  try {
    await addVc(override, referringUserId, USER_REFERRAL_VC_REWARD)
    await addUsersRecruited(referringUserId, 1)
  } catch (e) {
    throw e
  }

  return true
}

export default rewardReferringUser
