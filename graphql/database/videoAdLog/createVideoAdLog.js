import uuid from 'uuid/v4'
import moment from 'moment'
import VideoAdLogModel from './VideoAdLogModel'
/**
 * @param {Object} userContext - The user context.
 * @param {string} userId - The user's Id
 * @return {Promise<Object>}  A promise that resolves into an object containing a log id
 */

export default async (userContext, userId) =>
  VideoAdLogModel.create(userContext, {
    userId,
    id: uuid(),
    timestamp: moment.utc().toISOString(),
  })
