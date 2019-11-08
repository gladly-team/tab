const campaigns = {
  testNov2019: {
    campaignId: 'testNov2019',
  },
}

// Hardcode the currently-active campaign here.
const CURRENT_CAMPAIGN = campaigns.testNov2019

// eslint-disable-next-line import/prefer-default-export
export const getCurrentCampaign = () => {
  const isLive = process.env.IS_GLOBAL_CAMPAIGN_LIVE === 'true' || false
  return {
    ...CURRENT_CAMPAIGN,
    isLive,
  }
}
