import { getCurrentCampaign } from './getCampaignData'
import callRedis from '../../utils/redis'
import logger from '../../utils/logger'

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
  const campaign = getCurrentCampaign()
  if (!campaign || !campaign.isLive) {
    return {
      isLive: false,
    }
  }

  // Try to get the number of new users from this campaign.
  let numNewUsers = null
  try {
    numNewUsers = await callRedis({
      operation: 'GET',
      key: campaign.getNewUsersRedisKey(),
    })
  } catch (e) {
    logger.error(e)
  }

  return {
    isLive: campaign.isLive,
    ...(campaign.isLive && {
      campaignId: campaign.campaignId,
      numNewUsers,
    }),
  }
}

export default getCampaign
