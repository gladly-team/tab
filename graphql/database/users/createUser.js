
import { isEmpty } from 'lodash/lang'
import moment from 'moment'
import UserModel from './UserModel'
import logReferralData from '../referrals/logReferralData'
import rewardReferringUser from './rewardReferringUser'
import getUserByUsername from './getUserByUsername'
import setUpWidgetsForNewUser from '../widgets/setUpWidgetsForNewUser'
import logger from '../../utils/logger'

/**
 * Create a new user and performs other setup actions.
 * This function must be idempotent, as the client may call it
 * for existing users.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user's ID.
 * @param {string|null} email - The user's email (provided by the client, not
 *   from user claims)
 * @param {object|null} referralData - Referral data.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const createUser = async (userContext, userId, email = null, referralData = null) => {
  // Create the user.
  const userInfo = {
    id: userId,
    // This email address is from the user claims so will be
    // the same as the email address provided during authentication,
    // but it isn't guaranteed to be verified (may not truly belong
    // to the user).
    email: userContext.email || null,
    joined: moment.utc().toISOString()
  }
  try {
    var response = await UserModel.getOrCreate(userContext, userInfo)
  } catch (e) {
    throw e
  }
  const returnedUser = response.item

  // TODO: if the user already exists but the current email is different,
  //   update the email address and return the user.

  // If the user already existed, return it without doing other
  // setup tasks.
  if (!response.created) {
    return returnedUser
  }

  // Set up default widgets.
  try {
    await setUpWidgetsForNewUser(userContext, userId)
  } catch (e) {
    throw e
  }

  // Log referral data and reward referrer.
  if (referralData && !isEmpty(referralData)) {
    const referringUserUsername = referralData.referringUser
    const referringChannelId = (
      referralData.referringChannel
      ? referralData.referringChannel
      : null
    )

    // Referring user may not exist if referring username
    // was manipulated.
    var referringUserId = null
    try {
      if (referringUserUsername) {
        const referringUser = await getUserByUsername(userContext,
          referringUserUsername)
        referringUserId = referringUser.id
      }
    } catch (e) {}

    // Log the referral data.
    try {
      await logReferralData(userContext, userId, referringUserId, referringChannelId)
    } catch (e) {
      logger.error(new Error(`Could not log referrer data:
        user: ${userInfo.id},
        referring user: ${referringUserId}.
        ${e}
      `))
    }

    // Reward the referring user if one exists.
    if (referringUserId) {
      try {
        await rewardReferringUser(referringUserId)
      } catch (e) {
        logger.error(new Error(`Could not reward referring user with ID ${referringUserId}.`))
      }
    }
  }

  // Add the 'justCreated' field so the client can know it's
  // a brand new user
  returnedUser.justCreated = true
  return returnedUser
}

export default createUser
