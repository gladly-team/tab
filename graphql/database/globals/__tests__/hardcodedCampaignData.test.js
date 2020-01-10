/* eslint-env jest */
import { getCurrentCampaignHardcodedData } from '../hardcodedCampaignData'

describe('getCurrentCampaignHardcodedData', () => {
  it('returns an object with the expected properties', () => {
    expect.assertions(1)
    expect(getCurrentCampaignHardcodedData()).toEqual({
      campaignId: expect.any(String),
      countNewUsers: expect.any(Boolean),
      isLive: expect.any(Boolean),
      time: {
        start: expect.any(String),
        end: expect.any(String),
      },
    })
  })

  it('returns campaign.isLive === true when process.env.IS_GLOBAL_CAMPAIGN_LIVE is "true"', () => {
    expect.assertions(1)
    process.env.IS_GLOBAL_CAMPAIGN_LIVE = true
    expect(getCurrentCampaignHardcodedData()).toMatchObject({
      isLive: true,
    })
  })

  it('returns campaign.isLive === false when process.env.IS_GLOBAL_CAMPAIGN_LIVE is "false"', () => {
    expect.assertions(1)
    process.env.IS_GLOBAL_CAMPAIGN_LIVE = false
    expect(getCurrentCampaignHardcodedData()).toMatchObject({
      isLive: false,
    })
  })
})
