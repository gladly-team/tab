
import { isEmpty } from 'lodash/lang'
import { get } from 'lodash/object'
import moment from 'moment'
import UserModel from './UserModel'
import logReferralData from '../referrals/logReferralData'
import logEmailVerified from './logEmailVerified'
import logUserExperimentGroups from './logUserExperimentGroups'
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
 * @param {object|null} experimentGroups - Any experimental test groups to
 *   which the user has been assigned.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const createUser = async (userContext, userId, email = null, referralData = null, experimentGroups = {}) => {
  // Get or create the user.
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
  var returnedUser = response.item

  // If the user's email differs from the one in the database,
  // update it. This will happen when anonymous users sign in.
  if (returnedUser.email !== userContext.email) {
    returnedUser = await UserModel.update(userContext, {
      id: userId,
      email: userContext.email
    })
  }

  // If the user's email is verified but the user's emailVerified
  // property is false, update it. This can happen when a
  // previously-anonymous user signs in with a provider
  // whose emails are auto-verified (such as Google).
  if (userContext.emailVerified && !get(returnedUser, 'emailVerified')) {
    returnedUser = await logEmailVerified(userContext, userId)
  }

  // If the user already existed, return it without doing other
  // setup tasks.
  if (!response.created) {
    return returnedUser
  }

  /**
   * After this point, we handle setup for brand new users only.
   **/

  // Set up default widgets.
  try {
    await setUpWidgetsForNewUser(userContext, userId)
  } catch (e) {
    throw e
  }

  // Log referral data.
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
  }

  // Log the experimental groups to which the user belongs.
  try {
    returnedUser = await logUserExperimentGroups(userContext, userId, experimentGroups)
  } catch (e) {
    throw e
  }

  // Add the 'justCreated' field so the client can know it's
  // a brand new user
  returnedUser.justCreated = true
  return returnedUser
}

export default createUser
