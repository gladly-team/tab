import { isEmpty, isNil } from 'lodash/lang'
import { get } from 'lodash/object'
import { nanoid } from 'nanoid'
import moment from 'moment'
import UserModel from './UserModel'
import logReferralData from '../referrals/logReferralData'
import logEmailVerified from './logEmailVerified'
import logUserExperimentGroups from './logUserExperimentGroups'
import getUserByUsername from './getUserByUsername'
import setUpWidgetsForNewUser from '../widgets/setUpWidgetsForNewUser'
import logger from '../../utils/logger'
import getUserFeature from '../experiments/getUserFeature'
import { YAHOO_SEARCH_NEW_USERS } from '../experiments/experimentConstants'

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
 * @param {bool} v4BetaEnabled - Whether or not the new user is enabled for v4 Beta
 * @param {string|null} missionId - Mission ID corresponding to the mission that the new user is joining
 * @param {string|null} causeId - Cause that the new user belongs to.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const createUser = async (
  userContext,
  userId,
  email = null, // eslint-disable-line no-unused-vars
  referralData = null,
  experimentGroups = {},
  extensionInstallId = null,
  extensionInstallTimeApprox = null,
  v4BetaEnabled = false,
  missionId = false,
  causeId = false
) => {
  // Get or create the user.
  let userInfo = Object.assign(
    {
      id: userId,
      // This email address is from the user claims so will be
      // the same as the email address provided during authentication,
      // but it isn't guaranteed to be verified (may not truly belong
      // to the user).
      email: userContext.email || null,
      joined: moment.utc().toISOString(),
      truexId: nanoid(),
      currentMissionId: missionId || undefined,
      causeId: causeId || undefined,
    },
    !isNil(extensionInstallId)
      ? {
          extensionInstallId,
        }
      : null,
    !isNil(extensionInstallTimeApprox)
      ? {
          extensionInstallTimeApprox,
        }
      : null
  )

  // Set default background image to a cat image if user is enabled for v4 beta
  if (v4BetaEnabled) {
    userInfo = {
      ...userInfo,
      hasSeenSquads: !!missionId,
    }
  }

  let response
  try {
    response = await UserModel.getOrCreate(userContext, userInfo)
  } catch (e) {
    throw e
  }
  let returnedUser = response.item

  // If the user's email differs from the one in the database,
  // update it. This will happen when anonymous users sign in.
  if (returnedUser.email !== userContext.email) {
    returnedUser = await UserModel.update(userContext, {
      id: userId,
      email: userContext.email,
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
   * */

  // Set up default widgets.
  try {
    await setUpWidgetsForNewUser(userContext, userId)
  } catch (e) {
    throw e
  }

  // Log referral data.
  if (referralData && !isEmpty(referralData)) {
    const referringUserUsername = referralData.referringUser
    const referringChannelId = referralData.referringChannel
      ? referralData.referringChannel
      : null

    // Referring user may not exist if referring username
    // was manipulated.
    let referringUserId = null
    try {
      if (referringUserUsername) {
        const referringUser = await getUserByUsername(
          userContext,
          referringUserUsername
        )
        referringUserId = referringUser.id
      }
    } catch (e) {} // eslint-disable-line no-empty

    // Log the referral data.
    try {
      await logReferralData(
        userContext,
        userId,
        referringUserId,
        referringChannelId
      )
    } catch (e) {
      logger.error(
        new Error(`Could not log referrer data:
        user: ${userInfo.id},
        referring user: ${referringUserId}.
        ${e}
      `)
      )
    }
  }

  // Log the experimental groups to which the user belongs.
  try {
    returnedUser = await logUserExperimentGroups(
      userContext,
      userId,
      experimentGroups
    )
  } catch (e) {
    throw e
  }

  // Set user's search engine for new user
  try {
    const newSearchFeature = await getUserFeature(
      userContext,
      returnedUser,
      YAHOO_SEARCH_NEW_USERS
    )
    await UserModel.update(userContext, {
      id: userId,
      searchEngine: newSearchFeature.variation,
    })
  } catch (e) {
    throw e
  }

  // Add the 'justCreated' field so the client can know it's
  // a brand new user
  returnedUser.justCreated = true
  return returnedUser
}

export default createUser
