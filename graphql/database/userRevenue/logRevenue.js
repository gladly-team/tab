
import moment from 'moment'
import UserRevenueModel from './UserRevenueModel'

/**
 * Log revenue earned by a user.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {number} revenue - The $USD amount of revenue earned.
 * @param {string|null} dfpAdvertiserId - The DFP ID of the advertiser who paid the revenue.
 *   May be null if the advertiser identifier is not available on the client.
 *   Note that we stringify the DFP ID number because some are greater than 32 bits,
 *   which is not supported by default in GraphQL spec.
 * @return {null}
 */
const logRevenue = async (userContext, userId, revenue, dfpAdvertiserId = null) => {
  try {
    await UserRevenueModel.create(userContext, {
      userId: userId,
      timestamp: moment.utc().toISOString(),
      revenue: revenue,
      ...dfpAdvertiserId && { dfpAdvertiserId: dfpAdvertiserId }
    })
  } catch (e) {
    throw e
  }
  return { success: true }
}

export default logRevenue
