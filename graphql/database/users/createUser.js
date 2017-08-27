
import UserModel from './UserModel'
import logReferralData from '../referrals/logReferralData'
import rewardReferringUser from './rewardReferringUser'
import getUserByUsername from './getUserByUsername'
import setUpWidgetsForNewUser from '../widgets/setUpWidgetsForNewUser'

/**
 * Creates a new user and performs other setup actions.
 * @param {object} userContext - The user authorizer object.
 * @param {object} user - The user info.
 * @param {object} referralData - Referral data.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const createUser = async (userContext, userId, username,
    email, referralData) => {
  const userInfo = {
    id: userId,
    username: username,
    email: email
  }
  const createdUser = await UserModel.create(userContext, userInfo)
    .catch((err) => err)

  // Set up default widgets.
  try {
    await setUpWidgetsForNewUser(userContext, userId)
  } catch (err) {
    throw err
  }

  // Log referral data and reward referrer.
  if (referralData) {
    const referringUserUsername = referralData.referringUser
    const referringUser = await getUserByUsername(userContext,
      referringUserUsername)
    if (referringUser) {
      await logReferralData(userContext, userInfo.id, referringUser.id)
      await rewardReferringUser(referringUser.id)
    }
  }
  return createdUser
}

export default createUser
