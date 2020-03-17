// Hardcode campaign data here.
// Note: currently, we need to hardcode campaign start and end times
// both here and on the client side.
const campaigns = {
  testNov2019: {
    campaignId: 'testNov2019',
    countNewUsers: true,
    time: {
      start: '2019-11-12T10:00:00.000Z',
      end: '2020-01-10T20:00:00.000Z',
    },
  },
  treePlanting2019: {
    campaignId: 'treePlanting2019',
    countNewUsers: true,
    time: {
      start: '2019-11-14T18:00:00.000Z',
      end: '2020-01-10T24:00:00.000Z',
    },
  },
  australiaJan2020: {
    campaignId: 'australiaJan2020',
    countNewUsers: false,
    time: {
      start: '2020-01-10T22:00:00.000Z',
      end: '2020-01-21T20:00:00.000Z',
    },
  },
  earthjusticeFeb2020: {
    campaignId: 'earthJusticeFeb2020',
    countNewUsers: false,
    time: {
      start: '2020-02-22T23:00:00.000Z',
      end: '2020-02-27T23:00:00.000Z',
    },
  },
  covid19March2020: {
    campaignId: 'covid19March2020',
    countNewUsers: false,
    time: {
      start: '2020-03-17T18:00:00.000Z',
      end: '2020-05-01T18:00:00.000Z',
    },
  },
}

// Hardcode the currently-active campaign here.
const CURRENT_CAMPAIGN = campaigns.australiaJan2020

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
export const getCurrentCampaignHardcodedData = () => {
  const isLive = process.env.IS_GLOBAL_CAMPAIGN_LIVE === 'true' || false
  return {
    ...CURRENT_CAMPAIGN,
    isLive,
  }
}
