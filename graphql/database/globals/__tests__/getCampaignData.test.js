/* eslint-env jest */
import { getCurrentCampaign } from '../getCampaignData'

beforeEach(() => {
  process.env.IS_GLOBAL_CAMPAIGN_LIVE = false
})

describe('getCurrentCampaign', () => {
  it('returns an object with campaign.campaignId and campaign.isLive properties', () => {
    expect.assertions(1)
    expect(getCurrentCampaign()).toMatchObject({
      campaignId: expect.any(String),
      isLive: expect.any(Boolean),
    })
  })

  it('returns campaign.isLive === true when process.env.IS_GLOBAL_CAMPAIGN_LIVE is "true"', () => {
    expect.assertions(1)
    process.env.IS_GLOBAL_CAMPAIGN_LIVE = true
    expect(getCurrentCampaign()).toMatchObject({
      isLive: true,
    })
  })

  it('returns campaign.isLive === false when process.env.IS_GLOBAL_CAMPAIGN_LIVE is "false"', () => {
    expect.assertions(1)
    process.env.IS_GLOBAL_CAMPAIGN_LIVE = false
    expect(getCurrentCampaign()).toMatchObject({
      isLive: false,
    })
  })
})
