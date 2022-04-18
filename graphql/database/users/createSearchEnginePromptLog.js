import moment from 'moment'
import UserSwitchSearchPromptLogModel from './UserSwitchSearchPromptLogModel'
import UserModel from './UserModel'
/**
 * @param {Object} userContext - The user context.
 * @param {string} userId - The user's Id
 * @param {string} searchEnginePrompted - The user's Id
 * @param {boolean} switched - Whether or not the user switched their search engine
 * @return {Promise<Object>}  A promise that resolves into an object containing a log id
 */

export default async (userContext, userId, searchEnginePrompted, switched) => {
  try {
    await UserSwitchSearchPromptLogModel.create(userContext, {
      userId,
      searchEnginePrompted,
      switched,
      timestamp: moment.utc().toISOString(),
    })
    if (searchEnginePrompted === 'SearchForACause') {
      await UserModel.update(userContext, {
        id: userId,
        yahooSearchSwitchPrompt: {
          hasRespondedToPrompt: true,
          timestamp: moment.utc().toISOString(),
        },
      })
    }
  } catch (e) {
    throw e
  }

  return { success: true }
}
