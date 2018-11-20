
import moment from 'moment'
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
    // Make sure the startTime and endTime are rounded to hours, which is
    // how the data's bucketed in the table. Round the startTime down to the
    // beginning of this hour; round the endTime to 1ms before the end of the
    // hour (exclusive of the beginning of the hour).
    const startTimeRoundedISO = moment(startTime)
      .startOf('hour')
      .toISOString()
    const endTimeRoundedISO = moment(endTime)
      .subtract(1, 'millisecond')
      .endOf('hour')
      .toISOString()

    const hourlyVcReceivedItems = await VCDonationByCharityModel
      .query(userContext, charityId)
      .where('timestamp').between(startTimeRoundedISO, endTimeRoundedISO)
      .execute()
    const totalVc = hourlyVcReceivedItems
      .reduce((acc, vcDonationItem) => acc + vcDonationItem.vcDonated, 0)
    return totalVc
  } catch (e) {
    throw e
  }
}

export default getCharityVcReceived
