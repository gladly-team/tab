import UserModel from './UserModel'
import logger from '../../utils/logger'
import getCause from '../cause/getCause'
import setBackgroundImageDaily from './setBackgroundImageDaily'
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
    await UserModel.update(userContext, {
      id: userId,
      causeId,
      v4BetaEnabled: true,
    })
    const userUpdatedWithImage = setBackgroundImageDaily(userContext, userId)
    return userUpdatedWithImage
  } catch (e) {
    logger.error(e)
    throw e
  }
}

export default setUserCause
