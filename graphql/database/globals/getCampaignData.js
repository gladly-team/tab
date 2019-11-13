import moment from 'moment'

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
    return moment().isAfter(this.time.start) && moment().isBefore(this.time.end)
  },

  // Include other properties.
  ...data,
})

// Hardcode campaign data here.
// Note: currently, we need to hardcode campaign start and end times
// both here and on the client side.
const campaigns = {
  testNov2019: createCampaign({
    campaignId: 'testNov2019',
    time: {
      start: '2019-11-12T10:00:00.000Z',
      end: '2020-01-10T20:00:00.000Z',
    },
  }),
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
