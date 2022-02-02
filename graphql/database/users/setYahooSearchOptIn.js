import UserModel from './UserModel'
import logger from '../../utils/logger'

/**
 * Set whether or not the user has opted in to earn hearts via yahoo search.
 * @param {Object} userContext - The user authorizer object.
 * @param {String} userId - The user ID.
 * @param {boolean} optIn - Whether or not the user is opting int to yahoo paid search
 * @return {Promise<Object>} response - A Promise that resolves into a
 *   User object
 */
const setYahooSearchOptIn = async (userContext, userId, optIn) => {
  try {
    const user = await UserModel.update(userContext, {
      id: userId,
      yahooPaidSearchRewardOptIn: optIn,
    })
    return user
  } catch (e) {
    logger.error(e)
    throw e
  }
}

export default setYahooSearchOptIn
