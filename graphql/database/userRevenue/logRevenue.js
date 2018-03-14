
import moment from 'moment'
import UserRevenueModel from './UserRevenueModel'
import { isNil } from 'lodash/lang'

import decodeAmazonCPM from './decodeAmazonCPM'

const AMAZON_CPM_REVENUE_TYPE = 'AMAZON_CPM'
const AGGREGATION_MAX = 'MAX'

/**
 * Convert an encoded revenue object into a float value by a method specified
 * by the revenue object's "encodingType" field.
 * @param {object} revenueObj - The user authorizer object.
 * @param {string} revenueObj.encodingType - The name of the kind of object, which determines
 *   the logic we use to convert it into a number.
 * @param {string} revenueObj.encodingValue - The input value to use when decoding, which
 *   should resolve into a float.
 * @return {number} A float representing $USD amount of revenue
 */
const decodeRevenueObj = (revenueObj) => {
  var revenueVal
  switch (revenueObj.type) {
    case AMAZON_CPM_REVENUE_TYPE:
      revenueVal = decodeAmazonCPM(revenueObj.code) / 1000
      break
    default:
      throw new Error('Invalid "type" field for revenue object transformation')
  }
  return revenueVal
}

/**
 * Resolve an array of revenue float values down to a single float value by using
 * the specified aggregation logic.
 * @param {number[]} revenues - An array of one or more floats
 * @param {string} aggregationOperation - The name of the method we should use to resolve
 *   the revenue values down to a single revenue value
 * @return {number} A float representing $USD amount of revenue
 */
const aggregateRevenues = (revenues, aggregationOperation) => {
  var aggregatedRevenue
  switch (aggregationOperation) {
    case AGGREGATION_MAX:
      aggregatedRevenue = revenues.reduce((a, b) => Math.max(a, b))
      break
    default:
      throw new Error(`Invalid "aggregationOperation" value. Must be one of: "${AGGREGATION_MAX}"`)
  }
  return aggregatedRevenue
}

/**
 * Log revenue earned by a user.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {number|null} revenue - The $USD amount of revenue earned. Required if no argument
 *   is provided for "encodedRevenue".
 * @param {string|null} dfpAdvertiserId - The DFP ID of the advertiser who paid the revenue.
 *   May be null if the advertiser identifier is not available on the client.
 *   Note that we stringify the DFP ID number because some are greater than 32 bits,
 *   which is not supported by default in GraphQL spec.
 * @param {Object|null} encodedRevenue - An object that can be transformed into a revenue number.
 *   Required if no argument is provided for "revenue".
 * @param {string|null} aggregationOperation - What logic we should use to determine a final
 *   revenue value when more than one value is provided. Required if both "revenue" and
 *   "encodedRevenue" are provided.
 * @return {Object} If successful, a single key ("success") with value `true`
 */
const logRevenue = async (userContext, userId, revenue = null, dfpAdvertiserId = null,
  encodedRevenue = null, aggregationOperation = null) => {
  // Decode the encoded revenue, if needed
  const decodedRevenue = isNil(encodedRevenue) ? null : decodeRevenueObj(encodedRevenue)

  var revenueToLog = null
  // Only received "revenue"
  if (!isNil(revenue) && isNil(decodedRevenue)) {
    revenueToLog = revenue
  // Only received "encodedRevenue"
  } else if (!isNil(decodedRevenue) && isNil(revenue)) {
    revenueToLog = decodedRevenue
  // Received both "revenue" and "encodedRevenue"
  } else if (!isNil(revenue) && !isNil(decodedRevenue)) {
    if (isNil(aggregationOperation)) {
      throw new Error('Revenue logging requires an "aggregationOperation" value if both "revenue" and "encodedRevenue" values are provided')
    }
    revenueToLog = aggregateRevenues([revenue, decodedRevenue], aggregationOperation)
  // Received no valid revenue value
  } else {
    throw new Error('Revenue logging requires either "revenue" or "encodedRevenue" values')
  }

  // If the revenue is an object, transform it into a number
  // const revenueNum = isPlainObject(revenue) ? decodeRevenueObj(revenue) : revenue

  try {
    await UserRevenueModel.create(userContext, {
      userId: userId,
      timestamp: moment.utc().toISOString(),
      revenue: revenueToLog,
      ...dfpAdvertiserId && { dfpAdvertiserId: dfpAdvertiserId }
    })
  } catch (e) {
    throw e
  }
  return { success: true }
}

export default logRevenue
