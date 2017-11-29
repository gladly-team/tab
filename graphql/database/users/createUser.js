
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
 * @param {string} email - The user's email
 * @param {object} referralData - Referral data.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const createUser = async (userContext, userId, email, referralData) => {
  // Create the user.
  const userInfo = {
    id: userId,
    email: email,
    joined: moment.utc().toISOString()
  }
  try {
    var response = await UserModel.getOrCreate(userContext, userInfo)
  } catch (e) {
    throw e
  }
  const returnedUser = response.item

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
  if (referralData) {
    const referringUserUsername = referralData.referringUser
    const referringChannelId = (
      referralData.referringChannel
      ? referralData.referringChannel
      : null
    )
    try {
      const referringUser = await getUserByUsername(userContext,
        referringUserUsername)

      // Referring user may not exist if referring username
      // was manipulated.
      const referringUserId = referringUser ? referringUser.id : null

      // Log the referral data.
      try {
        await logReferralData(userContext, userInfo.id, referringUserId, referringChannelId)
      } catch (e) {
        logger.error(new Error(`Could not log referrer data:
          user: ${userInfo.id},
          referring user: ${referringUser.id}.
          ${e}
        `))
      }

      // Reward the referring user if one exists.
      if (referringUser) {
        try {
          await rewardReferringUser(referringUser.id)
        } catch (e) {
          logger.error(new Error(`Could not reward referring user with ID ${referringUser.id}.`))
        }
      }
    } catch (e) {}
  }
  return returnedUser
}

export default createUser
