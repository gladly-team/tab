/* eslint-env jest */
import getCurrentCampaignConfig from '../getCurrentCampaignConfig'

describe('getCurrentCampaignConfig', () => {
  it('returns an object with the expected required properties', () => {
    expect.assertions(1)
    expect(getCurrentCampaignConfig()).toMatchObject({
      campaignId: expect.any(String),
      content: {
        titleMarkdown: expect.any(String),
        descriptionMarkdown: expect.any(String),
      },
      getCharityData: expect.any(Function),
      incrementNewUserCount: expect.any(Function),
      incrementTabCount: expect.any(Function),
      isActive: expect.any(Function),
      isLive: expect.any(Boolean),
      showCountdownTimer: expect.any(Boolean),
      showHeartsDonationButton: expect.any(Boolean),
      showProgressBar: expect.any(Boolean),
      time: {
        start: expect.any(String),
        end: expect.any(String),
      },
    })
  })

  it('returns campaign.isLive === true when process.env.IS_GLOBAL_CAMPAIGN_LIVE is "true"', () => {
    expect.assertions(1)
    process.env.IS_GLOBAL_CAMPAIGN_LIVE = true
    expect(getCurrentCampaignConfig()).toMatchObject({
      isLive: true,
    })
  })

  it('returns campaign.isLive === false when process.env.IS_GLOBAL_CAMPAIGN_LIVE is "false"', () => {
    expect.assertions(1)
    process.env.IS_GLOBAL_CAMPAIGN_LIVE = false
    expect(getCurrentCampaignConfig()).toMatchObject({
      isLive: false,
    })
  })
})
