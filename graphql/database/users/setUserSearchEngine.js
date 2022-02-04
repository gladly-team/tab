import moment from 'moment'
import UserModel from './UserModel'
import logger from '../../utils/logger'
import UserSearchSettingsLogModel from './UserSearchSettingsLogModel'
import { DEFAULT_SEARCH_ENGINE } from '../constants'

/**
 * Sets the search engine of a user. Also creates an instance of UserSearchSettingsLog
 * @param {Object} userContext - The user authorizer object.
 * @param {String} userId - The user ID.
 * @param {String} searchEngine - The search engine user is switching to.
 * @return {Promise<Object>} response - A Promise that resolves into a
 *   User object
 */
const setUserSearchEngine = async (userContext, userId, searchEngine) => {
  try {
    const oldUser = await UserModel.get(userContext, userId)
    if (searchEngine === oldUser.searchEngine) {
      return oldUser
    }
    const user = await UserModel.update(userContext, {
      id: userId,
      searchEngine,
    })
    UserSearchSettingsLogModel.create(userContext, {
      userId,
      previousEngine: oldUser.searchEngine
        ? oldUser.searchEngine
        : DEFAULT_SEARCH_ENGINE,
      newEngine: searchEngine,
      timestamp: moment.utc().toISOString(),
    })
    return user
  } catch (e) {
    logger.error(e)
    throw e
  }
}

export default setUserSearchEngine
