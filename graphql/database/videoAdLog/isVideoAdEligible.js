import moment from 'moment'
import VideoAdLogModel from './VideoAdLogModel'
/**
 * @param {Object} userContext - The user context.
 * @param {string} userId - The user object
 * @return {Promise<Object>}  A promise that resolves into a boolean on whether user is video ad eligible
 */

export default async (userContext, { id: userId }) =>
  (await VideoAdLogModel.query(userContext, userId)
    .where('timestamp')
    .between(
      moment()
        .subtract(1, 'day')
        .toISOString(),
      moment().toISOString()
    )
    .filter('completed')
    .equals(true)
    .execute()).length < 3
