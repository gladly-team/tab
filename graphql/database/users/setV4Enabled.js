import UserModel from './UserModel'
import logger from '../../utils/logger'

/**
 * Set whether the user should use the Tab V4 beta app.
 * @param {Object} userContext - The user authorizer object.
 * @param {String} userId - The user ID.
 * @param {String} enabled - Whether the V4 beta is enabled.
 * @return {Promise<Object>} response - A Promise that resolves into a
 *   User object
 */
const setV4Enabled = async (userContext, { userId, enabled }) => {
  try {
    const user = await UserModel.update(userContext, {
      id: userId,
      v4BetaEnabled: enabled,
    })
    return user
  } catch (e) {
    logger.error(e)
    throw e
  }
}

export default setV4Enabled
