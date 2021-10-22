import UserModel from './UserModel'
import logger from '../../utils/logger'
import getCause from '../cause/getCause'

/**
 * Set the cause ID for a user..
 * @param {Object} userContext - The user authorizer object.
 * @param {String} userId - The user ID.
 * @param {String} causeId - The cause ID.
 * @return {Promise<Object>} response - A Promise that resolves into a
 *   User object
 */
const setUserCause = async (userContext, userId, causeId) => {
  try {
    await getCause(causeId) // Will throw if cause does not exist.
    const user = await UserModel.update(userContext, {
      id: userId,
      causeId,
    })
    return user
  } catch (e) {
    logger.error(e)
    throw e
  }
}

export default setUserCause
