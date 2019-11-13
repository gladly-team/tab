/* eslint-env jest */
import moment from 'moment'
import MockDate from 'mockdate'
import { getCurrentCampaign } from '../getCampaignData'

const mockNow = '2017-05-19T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))
  process.env.IS_GLOBAL_CAMPAIGN_LIVE = false
})

afterEach(() => {
  MockDate.reset()
})

describe('getCurrentCampaign', () => {
  it('returns an object with the expected properties', () => {
    expect.assertions(1)
    expect(getCurrentCampaign()).toEqual({
      campaignId: expect.any(String),
      isLive: expect.any(Boolean),
      getNewUsersRedisKey: expect.any(Function),
      isActive: expect.any(Function),
      time: {
        start: expect.any(String),
        end: expect.any(String),
      },
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

  it('creates the expected string when calling getNewUsersRedisKey', () => {
    expect.assertions(1)
    const campaign = getCurrentCampaign()
    expect(getCurrentCampaign().getNewUsersRedisKey()).toEqual(
      `campaign:${campaign.campaignId}:newUsers`
    )
  })

  // TODO
  // it("the isActive method returns true when the current time is between the campaign's start and end times", () => {
  //   expect.assertions(1)
  //   const campaign = getCurrentCampaign()
  //   expect(getCurrentCampaign().getNewUsersRedisKey()).toEqual(
  //     `campaign:${campaign.campaignId}:newUsers`
  //   )
  // })
})
