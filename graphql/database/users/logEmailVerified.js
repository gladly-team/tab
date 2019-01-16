import UserModel from './UserModel'
import rewardReferringUser from './rewardReferringUser'
import logger from '../../utils/logger'

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
    } catch (e) {
      logger.error(
        new Error(`Could not reward referring user for user ID ${userId}.`)
      )
    }
  }

  return returnedUser
}

export default logEmailVerified
