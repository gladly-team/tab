
import moment from 'moment'
import UserModel from './UserModel'
import logReferralData from '../referrals/logReferralData'
import rewardReferringUser from './rewardReferringUser'
import getUserByUsername from './getUserByUsername'
import setUpWidgetsForNewUser from '../widgets/setUpWidgetsForNewUser'
import logger from '../../utils/logger'

/**
 * Creates a new user and performs other setup actions.
 * @param {object} userContext - The user authorizer object.
 * @param {object} user - The user info.
 * @param {object} referralData - Referral data.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const createUser = async (userContext, userId, username,
    email, referralData) => {
  // Create the user.
  const userInfo = {
    id: userId,
    username: username,
    email: email,
    joined: moment.utc().toISOString()
  }
  try {
    var createdUser = await UserModel.create(userContext, userInfo)
  } catch (e) {
    throw e
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
    try {
      const referringUser = await getUserByUsername(userContext,
        referringUserUsername)
      // Referring user may not exist if referring username
      // was manipulated.
      if (referringUser) {
        try {
          await logReferralData(userContext, userInfo.id, referringUser.id)
        } catch (e) {
          logger.error(new Error(`Could not log referrer data:
            user: ${userInfo.id},
            referring user: ${referringUser.id}.
          `))
        }
        try {
          await rewardReferringUser(referringUser.id)
        } catch (e) {
          logger.error(new Error(`Could not reward referring user with ID ${referringUser.id}.`))
        }
      }
    } catch (e) {}
  }
  return createdUser
}

export default createUser
