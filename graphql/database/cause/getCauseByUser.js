import UserModel from '../users/UserModel'
import getCause from './getCause'

/**
 * Get a cause record based on user record
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<User>}  A promise that resolves into a Cause instance.
 */

const getCauseByUser = async (userContext, userId) => {
  const user = await UserModel.get(userContext, userId)
  return getCause(user.causeId)
}

export default getCauseByUser
