/* eslint-env jest */
import getCurrentCampaignConfig from '../getCurrentCampaignConfig'
import createCampaignConfiguration from '../createCampaignConfiguration'

jest.mock('../createCampaignConfiguration')

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

// Test the transformNumberSourceValue function, which is unique
// to each campaign.
describe('getCurrentCampaignConfig: transformNumberSourceValue', () => {
  it('behaves as expected for the current campaign', () => {
    getCurrentCampaignConfig()
    const configInput = createCampaignConfiguration.mock.calls[0][0]
    if (!configInput.goal || !configInput.goal.transformNumberSourceValue) {
      // The input does not define a goal.transformNumberSourceValue,
      // so there is no need to test it.
      expect(true).toBe(true)
      return
    }
    const transformFunc = configInput.goal.transformNumberSourceValue

    // Test campaign-specific transform logic here.
    expect(transformFunc(1.0)).toEqual(5)
    expect(transformFunc(29)).toEqual(145)
    expect(transformFunc(0.19)).toEqual(0)
    expect(transformFunc(0.2)).toEqual(1)
    expect(transformFunc(0.21)).toEqual(1)
  })
})
