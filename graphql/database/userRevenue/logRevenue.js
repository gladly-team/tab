
import moment from 'moment'
import UserRevenueModel from './UserRevenueModel'
import { isPlainObject } from 'lodash/lang'

import decodeAmazonCPM from './decodeAmazonCPM'

const AMAZON_CPM_REVENUE_TYPE = 'AMAZON_CPM'

const transformRevenueObj = (revenueObj) => {
  var revenueVal
  switch (revenueObj.type) {
    case AMAZON_CPM_REVENUE_TYPE:
      revenueVal = decodeAmazonCPM(revenueObj.code) / 1000
      break
    default:
      throw new Error('Invalid "type" field for revenue object transformation.')
  }
  return revenueVal
}

/**
 * Log revenue earned by a user.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {number|Object} revenue - The $USD amount of revenue earned; or, an object
 *   that will be transformed into a revenue number
 * @param {string|null} dfpAdvertiserId - The DFP ID of the advertiser who paid the revenue.
 *   May be null if the advertiser identifier is not available on the client.
 *   Note that we stringify the DFP ID number because some are greater than 32 bits,
 *   which is not supported by default in GraphQL spec.
 * @return {null}
 */
const logRevenue = async (userContext, userId, revenue, dfpAdvertiserId = null) => {
  // If the revenue is an object, transform it into a number
  const revenueNum = isPlainObject(revenue) ? transformRevenueObj(revenue) : revenue

  try {
    await UserRevenueModel.create(userContext, {
      userId: userId,
      timestamp: moment.utc().toISOString(),
      revenue: revenueNum,
      ...dfpAdvertiserId && { dfpAdvertiserId: dfpAdvertiserId }
    })
  } catch (e) {
    throw e
  }
  return { success: true }
}

export default logRevenue
