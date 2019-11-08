/* eslint-env jest */
import getCampaign from '../getCampaign'
import { getCurrentCampaign } from '../getCampaignData'

jest.mock('../getCampaignData')

beforeEach(() => {
  getCurrentCampaign.mockReturnValue({
    campaignId: 'someCampaign',
    isLive: true,
  })
})

describe('getCampaign', () => {
  it('returns an object with the correct campaign ID', async () => {
    expect.assertions(1)
    getCurrentCampaign.mockReturnValue({
      campaignId: 'someCampaignIdHere',
      isLive: true,
    })
    expect(await getCampaign()).toMatchObject({
      campaignId: 'someCampaignIdHere',
    })
  })

  it('returns an object with the isLive property === true when the campaign is live', async () => {
    expect.assertions(1)
    expect(await getCampaign()).toMatchObject({
      isLive: true,
    })
  })

  it('returns an object with the isLive property === false when the campaign is not live', async () => {
    expect.assertions(1)
    getCurrentCampaign.mockReturnValue({
      campaignId: 'someCampaignIdHere',
      isLive: false,
    })
    expect(await getCampaign()).toMatchObject({
      isLive: false,
    })
  })

  it('does not include the campaignId property when the campaign is not live', async () => {
    expect.assertions(1)
    getCurrentCampaign.mockReturnValue({
      campaignId: 'someCampaignIdHere',
      isLive: false,
    })
    expect((await getCampaign()).id).toBeUndefined()
  })
})
