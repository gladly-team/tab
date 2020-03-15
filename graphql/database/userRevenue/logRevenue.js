import moment from 'moment'
import { isNil } from 'lodash/lang'
import { random } from 'lodash/number'
import { DatabaseConditionalCheckFailedException } from '../../utils/exceptions'
import UserRevenueModel from './UserRevenueModel'
import decodeAmazonCPM from './decodeAmazonCPM'

const AMAZON_CPM_REVENUE_TYPE = 'AMAZON_CPM'
const AGGREGATION_MAX = 'MAX'

/**
 * Return an object representing one ad's revenue.
 * @param {number|null} revenue - The $USD amount of revenue earned.
 * @param {string|null} adSize - The ad dimensions, in form 'WIDTHxHEIGHT'
 * @return {Object}
 */
const AdRevenue = (revenue, adSize) => ({
  revenue: revenue || null,
  adSize: adSize || null,
})

/**
 * Convert an encoded revenue object into a float value by a method specified
 * by the revenue object's "encodingType" field.
 * @param {object} revenueObj - The user authorizer object.
 * @param {string} revenueObj.encodingType - The name of the kind of object, which determines
 *   the logic we use to convert it into a number.
 * @param {string} revenueObj.encodedValue - The input value to use when decoding, which
 *   should resolve into a float.
 * @return {Object} An AdRevenue object
 */
const decodeRevenueObj = revenueObj => {
  if (!revenueObj) {
    return AdRevenue()
  }
  let revenueVal
  let adSize
  switch (revenueObj.encodingType) {
    case AMAZON_CPM_REVENUE_TYPE: {
      const decodedCPM = decodeAmazonCPM(revenueObj.encodedValue)
      if (isNil(decodedCPM)) {
        throw new Error(
          `Amazon revenue code "${
            revenueObj.encodedValue
          }" resolved to a nil value`
        )
      }
      revenueVal = decodedCPM / 1000
      // eslint-disable-next-line prefer-destructuring
      adSize = revenueObj.adSize
      break
    }
    default:
      throw new Error(
        'Invalid "encodingType" field for revenue object transformation'
      )
  }
  return AdRevenue(revenueVal, adSize)
}

/**
 * Resolve an array of revenue float values down to a single float value by using
 * the specified aggregation logic.
 * @param {AdRevenue[]} revenueObjs - An array of one or more AdRevenue objects
 * @param {string} aggregationOperation - The name of the method we should use to resolve
 *   the revenue values down to a single revenue value
 * @return {Object} An AdRevenue object
 */
const aggregateRevenues = (revenueObjs, aggregationOperation) => {
  let aggregatedRevenue
  switch (aggregationOperation) {
    case AGGREGATION_MAX:
      aggregatedRevenue = revenueObjs.reduce((a, b) =>
        a.revenue > b.revenue ? a : b
      )
      break
    default:
      throw new Error(
        `Invalid "aggregationOperation" value. Must be one of: "${AGGREGATION_MAX}"`
      )
  }
  return aggregatedRevenue
}

/**
 * Add a random number of milliseconds (between 1 and 20 ms) to an
 * ISO string datetime.
 * @param {String} ISODatetime - An ISO datetime string
 * @return {String} An ISO datetime with the milliseconds up to
 *   150ms greater than the provided ISODatetime.
 */
const addMillisecondsToISODatetime = ISODatetime => {
  const msToAdd = random(1, 150)
  return moment(ISODatetime)
    .add(msToAdd, 'milliseconds')
    .toISOString()
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
 * @param {Object|null} encodedRevenue - An object that can be transformed into an AdRevenue
 *   object. Required if no argument is provided for "revenue".
 * @param {string|null} aggregationOperation - What logic we should use to determine a final
 *   revenue value when more than one value is provided. Required if both "revenue" and
 *   "encodedRevenue" are provided.
 * @param {string} tabId - A UUID for the tab on which revenue is created
 * @param {string} adSize - The ad dimensions, in form 'WIDTHxHEIGHT'
 * @param {string|null} adUnitCode - The DFP ID for the ad slot.
 * @return {Object} If successful, a single key ("success") with value `true`
 */
const logRevenue = async (
  userContext,
  userId,
  revenue = null,
  dfpAdvertiserId = null,
  encodedRevenue = null,
  aggregationOperation = null,
  tabId = null,
  adSize = null,
  adUnitCode = null
) => {
  const revenueObj = AdRevenue(revenue, adSize)

  // Decode the encoded revenue, if needed
  const decodedRevenueObj = decodeRevenueObj(encodedRevenue)

  let revenueObjToLog = null
  // Received no valid revenue value
  if (isNil(revenueObj.revenue) && isNil(decodedRevenueObj.revenue)) {
    throw new Error(
      'Revenue logging requires either "revenue" or "encodedRevenue" values'
    )
    // Only received "revenue"
  } else if (!isNil(revenueObj.revenue) && isNil(decodedRevenueObj.revenue)) {
    revenueObjToLog = revenueObj
    // Only received "encodedRevenue"
  } else if (!isNil(decodedRevenueObj.revenue) && isNil(revenueObj.revenue)) {
    revenueObjToLog = decodedRevenueObj
    // Received both "revenue" and "encodedRevenue"
  } else if (!isNil(revenueObj.revenue) && !isNil(decodedRevenueObj.revenue)) {
    if (isNil(aggregationOperation)) {
      throw new Error(
        'Revenue logging requires an "aggregationOperation" value if both "revenue" and "encodedRevenue" values are provided'
      )
    }
    revenueObjToLog = aggregateRevenues(
      [revenueObj, decodedRevenueObj],
      aggregationOperation
    )
  }

  const ISOTimestamp = moment.utc().toISOString()
  function createRevenueLogItem() {
    const createdISOTimestamp = addMillisecondsToISODatetime(ISOTimestamp)
    return UserRevenueModel.create(userContext, {
      userId,
      timestamp: createdISOTimestamp,
      revenue: revenueObjToLog.revenue,
      ...(dfpAdvertiserId && { dfpAdvertiserId }),
      ...(tabId && { tabId }),
      ...(revenueObjToLog.adSize && { adSize: revenueObjToLog.adSize }),
      ...(adUnitCode && { adUnitCode }),
    })
  }

  let i = 0
  const maxTries = 4
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await createRevenueLogItem() // eslint-disable-line no-await-in-loop
      break // successfully logged
    } catch (e) {
      i += 1
      // If the DB conditional check, failed, an item already exists with these
      // keys. In that case, try to log again with modified timestamps.
      // This happens when a user logs two revenue items at the exact
      // same millisecond. We had assumed user ID (hash key) and timestamp
      // (sort key) would be sufficiently unique, but that's not always true.
      // https://github.com/gladly-team/tab/issues/330
      if (e.code === DatabaseConditionalCheckFailedException.code) {
        if (i > maxTries) {
          throw e
        }
      } else {
        throw e
      }
    }
  }
  return { success: true }
}

export default logRevenue
