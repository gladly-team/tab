
import { isValidISOString } from '../../utils/utils'
import VCDonationByCharityModel from './VCDonationByCharityModel'

/**
 * Get the total VC donated to a charity betweeen two times (rounded to
 * the beginning and end of hour periods).
 * @param {Object} userContext - The user authorizer object.
 * @param {String} charityId - The ID of the charity to query
 * @param {String} startTime - An ISO string of the beginning of the time
 *   period to query.
 * @param {String} endTime - An ISO string of the end of the time period to query.
 * @return {Promise<Number>} Returns a promise that resolves into a number.
 */
const getCharityVcReceived = async (userContext, charityId, startTime, endTime) => {
  if (!(startTime && isValidISOString(startTime) && endTime && isValidISOString(endTime))) {
    throw new Error('You must provide valid ISO strings for `startTime` and `endTime` arguments.')
  }
  try {
    // TODO
    // Make sure the startTime and endTime are rounded to hours, which is
    // how the data's bucketed in the table. Round the startTime down to the
    // beginning of this hour and round the endTime up to the beginning of
    // the next hour.

    const hourlyVcReceivedItems = await VCDonationByCharityModel
      .query(userContext, charityId)
      .where('timestamp').between(startTime, endTime)
      .execute()
    const totalVc = hourlyVcReceivedItems
      .reduce((acc, vcDonationItem) => acc + vcDonationItem.vcDonated, 0)
    return totalVc
  } catch (e) {
    throw e
  }
}

export default getCharityVcReceived
