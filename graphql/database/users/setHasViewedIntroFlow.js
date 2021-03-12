import UserModel from './UserModel'
import logger from '../../utils/logger'

/**
 * Set whether the user has viewed the intro flow in Tab V4 beta app.
 * @param {Object} userContext - The user authorizer object.
 * @param {String} userId - The user ID.
 * @param {String} enabled - Whether user has seen intro flow.
 * @return {Promise<Object>} response - A Promise that resolves into a
 *   User object
 */
const hasViewedIntroFlow = async (userContext, { userId, enabled }) => {
  try {
    const user = await UserModel.update(userContext, {
      id: userId,
      hasViewedIntroFlow: enabled,
    })
    return user
  } catch (e) {
    logger.error(e)
    throw e
  }
}

export default hasViewedIntroFlow
