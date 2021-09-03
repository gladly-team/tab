import UserModel from './UserModel'
import logger from '../../utils/logger'

/**
 * Set whether the user has viewed the intro flow in Tab V4 beta app.
 * @param {Object} userContext - The user authorizer object.
 * @param {String} userId - The user ID.
 * @return {Promise<Object>} response - A Promise that resolves into a
 *   User object
 */
const setHasSeenSquads = async (userContext, userId) => {
  try {
    const user = await UserModel.update(userContext, {
      id: userId,
      hasSeenSquads: true,
    })
    return user
  } catch (e) {
    logger.error(e)
    throw e
  }
}

export default setHasSeenSquads
