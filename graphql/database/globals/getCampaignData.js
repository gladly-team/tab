const createCampaign = data => ({
  campaignId: data.campaignId,
  getNewUsersRedisKey() {
    return `campaign:${this.campaignId}:newUsers`
  },
})

const campaigns = {
  testNov2019: createCampaign({ campaignId: 'testNov2019' }),
}

// Hardcode the currently-active campaign here.
const CURRENT_CAMPAIGN = campaigns.testNov2019

/**
 * Return the hardcoded campaign info for the current campaign.
 * @return {Promise<Object>} campaign
 * @return {String|undefined} campaign.campaignId - the unique ID of the
 *   campaign.
 * @return {Boolean} campaign.isLive - whether we should show the campaign
 *   on the new tab page.
 * @return {Function} campaign.getNewUsersRedisKey - a function that returns
 *   a string of the Redis key value. The Redis item stores the number of new
 *   users who joined during this campaign.
 */
// eslint-disable-next-line import/prefer-default-export
export const getCurrentCampaign = () => {
  const isLive = process.env.IS_GLOBAL_CAMPAIGN_LIVE === 'true' || false
  return {
    ...CURRENT_CAMPAIGN,
    isLive,
  }
}
