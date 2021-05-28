import UserModel from './UserModel'
import rewardReferringUser from './rewardReferringUser'
import logger from '../../utils/logger'
import InvitedUsersModel from '../invitedUsers/InvitedUsersModel'
import {
  ADMIN_MANAGEMENT,
  getPermissionsOverride,
} from '../../utils/permissions-overrides'

/**
 * Log that a user's email is verified, using the trustworthy
 * user context to know that the email is truly verified. Then,
 * perform any other actions that occur when a user is
 * verified. Important: this function must be idempotent,
 * because it could be called multiple times.
 * @param {object} userContext - The user authorizer object.
 * @param {string} id - The user id.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const logEmailVerified = async (userContext, userId) => {
  let returnedUser
  try {
    returnedUser = await UserModel.update(userContext, {
      id: userId,
      emailVerified: userContext.emailVerified,
    })
  } catch (e) {
    throw e
  }

  // If the user's email is verified, reward their
  // referring user. `rewardReferringUser` is idempotent
  // so it's okay that we might call it more than once.
  if (userContext.emailVerified) {
    try {
      await rewardReferringUser(userContext, userId)
      const override = getPermissionsOverride(ADMIN_MANAGEMENT)
      const originalInvitedUsers = await InvitedUsersModel.query(
        override,
        userContext.email
      )
        .usingIndex('InvitesByInvitedEmail')
        .execute()
      await Promise.all(
        originalInvitedUsers.map(invitedUserEntry =>
          InvitedUsersModel.update(override, {
            ...invitedUserEntry,
            invitedId: userId,
          })
        )
      )
    } catch (e) {
      logger.error(
        new Error(`Could not reward referring user for user ID ${userId}.`)
      )
    }
  }

  return returnedUser
}

export default logEmailVerified
