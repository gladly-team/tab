
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
 * @param {string} email - The user's email
 * @param {object} referralData - Referral data.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const createUser = async (userContext, userId, email, referralData) => {
  console.log('createUser begins', userId, email, referralData)
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

  console.log('createUser: created user successfully')

  // If the user already existed, return it without doing other
  // setup tasks.
  if (!response.created) {
    console.log('createUser: user alredy created, so returning.')
    return returnedUser
  }

  // Set up default widgets.
  try {
    await setUpWidgetsForNewUser(userContext, userId)
  } catch (e) {
    throw e
  }

  console.log('createUser: set up widgets successfully')

  // Log referral data and reward referrer.
  if (referralData && !isEmpty(referralData)) {
    console.log('createUser: inside referralData block')

    const referringUserUsername = referralData.referringUser
    const referringChannelId = (
      referralData.referringChannel
      ? referralData.referringChannel
      : null
    )

    console.log('createUser: referringUserUsername and referringChannelId', referringUserUsername, referringChannelId)

    // Referring user may not exist if referring username
    // was manipulated.
    var referringUserId = null
    try {
      console.log('createUser: about to getUserByUsername')
      const referringUser = await getUserByUsername(userContext,
        referringUserUsername)
      console.log('createUser: referring user:', referringUser)
      referringUserId = referringUser.id
      console.log('createUser: referring user ID:', referringUserId)
    } catch (e) {
      console.error(e)
    }

    // Log the referral data.
    try {
      console.log('createUser: about to log referal data')
      await logReferralData(userContext, userId, referringUserId, referringChannelId)
    } catch (e) {
      console.error(e)
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
  console.log('createUser: finished')
  return returnedUser
}

export default createUser
