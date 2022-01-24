import moment from 'moment'
import UserExperimentModel from './UserExperimentModel'
import logger from '../../utils/logger'

/**
 * @param {Object} userContext - The user context.
 * @param {string} userId - The user's Id
 * @param {string} experimentId - The experiment's Id
 * @param {string} variationId - The variation's Id
 * @return {Promise<Object>}  A promise that resolves into an object containing a log id
 */

export default async (userContext, userId, experimentId, variationId) => {
  try {
    const userExperimentRecord = await UserExperimentModel.getOrCreate(
      userContext,
      {
        userId,
        experimentId,
        variationId,
        timestampAssigned: moment.utc().toISOString(),
      }
    )
    if (
      !userExperimentRecord.created &&
      userExperimentRecord.item.variationId !== variationId
    ) {
      logger.warn(
        `Expected to see same variationId ${
          userExperimentRecord.item.variationId
        } for userId ${userId} and experimentId ${experimentId}, instead received variation ${variationId}`
      )
    }
  } catch (e) {
    throw e
  }

  return { success: true }
}
