import moment from 'moment'
import { getCurrentCampaignHardcodedData } from './hardcodedCampaignData'
import callRedis from '../../utils/redis'
import logger from '../../utils/logger'

const createCampaign = data => ({
  campaignId: data.campaignId,

  /**
   * Return the Redis key used to store the new user count during this
   * campaign.
   * @return {String} the Redis key
   */
  getNewUsersRedisKey() {
    return `campaign:${this.campaignId}:newUsers`
  },

  /**
   * Return whether the current time is between the campaign's start and
   * end times.
   * @return {Boolean}
   */
  isActive() {
    const timeInfo = data.time
    return moment().isAfter(timeInfo.start) && moment().isBefore(timeInfo.end)
  },

  isLive: data.isLive,
})

export const getCampaignObject = () => {
  return createCampaign(getCurrentCampaignHardcodedData())
}

/**
 * Return data about any currently-live campaign.
 * @return {Promise<Object>} campaign - a Promise that resolves into a
 *   Campaign object.
 * @return {String|undefined} campaign.campaignId - the unique ID of the campaign.
 *   This may be undefined if the campaign is not live.
 * @return {Boolean} campaign.isLive - whether we should show the campaign
 *   on the new tab page.
 */
const getCampaign = async () => {
  const campaign = getCampaignObject()

  // TODO: revert this after testing out Redis.
  // if (!campaign || !campaign.isLive) {
  //   return {
  //     isLive: false,
  //   }
  // }

  // Try to get the number of new users from this campaign.
  // Default to zero if the item doesn't exist or fails to
  // fetch.
  let numNewUsers = 0
  try {
    numNewUsers = await callRedis({
      operation: 'GET',
      key: campaign.getNewUsersRedisKey(),
    })
    if (!numNewUsers) {
      numNewUsers = 0
    }
  } catch (e) {
    logger.error(e)
  }

  return {
    isLive: campaign.isLive,
    campaignId: campaign.campaignId,
    numNewUsers,
  }
}

export default getCampaign
