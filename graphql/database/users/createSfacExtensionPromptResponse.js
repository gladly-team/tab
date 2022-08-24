import moment from 'moment'
import uuid from 'uuid/v4'
import UserEventLogModel from '../logs/UserEventLogModel'
import UserModel from './UserModel'
import { SFAC_EXTENSION_PROMPT } from '../logs/logTypes'

/**
 * @param {Object} userContext - The user context.
 * @param {string} userId - The user's Id
 * @param {string} browser - What browser the client used to respond with
 * @param {boolean} accepted - Whether or not the client responded to the prompt affirmatively
 *
 * @return {Promise<Object>}  A promise that resolves to the user
 */

export default async (userContext, userId, browser, accepted) => {
  try {
    await UserEventLogModel.create(userContext, {
      id: uuid(),
      userId,
      type: SFAC_EXTENSION_PROMPT,
      eventData: {
        browser,
        accepted,
      },
      timestamp: moment.utc().toISOString(),
    })

    return await UserModel.update(userContext, {
      id: userId,
      sfacPrompt: {
        hasRespondedToPrompt: true,
        timestamp: moment.utc().toISOString(),
      },
    })
  } catch (e) {
    throw e
  }
}
