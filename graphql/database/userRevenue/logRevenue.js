
import moment from 'moment'
import UserRevenueModel from './UserRevenueModel'

/**
 * Log revenue earned by a user.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {number} revenue - The $USD amount of revenue earned.
 * @return {null}
 */
const logRevenue = async (userContext, userId, revenue) => {
  try {
    await UserRevenueModel.create(userContext, {
      userId: userId,
      timestamp: moment.utc().toISOString(),
      revenue: revenue
    })
  } catch (e) {
    throw e
  }
  return { success: true }
}

export default logRevenue
