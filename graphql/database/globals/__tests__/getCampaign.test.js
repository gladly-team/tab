/* eslint-env jest */
import getCampaign from '../getCampaign'
import { getCurrentCampaign } from '../getCampaignData'
import callRedis from '../../../utils/redis'
import logger from '../../../utils/logger'

jest.mock('../getCampaignData')
jest.mock('../../../utils/redis')
jest.mock('../../../utils/logger')

const getMockCurrentCampaign = ({
  campaignId = 'someCampaign',
  ...otherProps
} = {}) => ({
  campaignId,
  isLive: true,
  getNewUsersRedisKey: jest.fn(() => `campaign:${campaignId}:newUsers`),
  ...otherProps,
})

beforeEach(() => {
  getCurrentCampaign.mockReturnValue(getMockCurrentCampaign())
  callRedis.mockResolvedValue(28)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('getCampaign', () => {
  it('returns an object with the correct campaign ID', async () => {
    expect.assertions(1)
    getCurrentCampaign.mockReturnValue(
      getMockCurrentCampaign({ campaignId: 'someCampaignIdHere' })
    )
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
    getCurrentCampaign.mockReturnValue(
      getMockCurrentCampaign({
        campaignId: 'someCampaignIdHere',
        isLive: false,
      })
    )
    expect(await getCampaign()).toMatchObject({
      isLive: false,
    })
  })

  it('does not include the campaignId property when the campaign is not live', async () => {
    expect.assertions(1)
    getCurrentCampaign.mockReturnValue(
      getMockCurrentCampaign({
        campaignId: 'someCampaignIdHere',
        isLive: false,
      })
    )
    expect((await getCampaign()).id).toBeUndefined()
  })

  it('calls Redis to get the "numNewUsers" value when the campaign is live', async () => {
    expect.assertions(1)
    getCurrentCampaign.mockReturnValue(
      getMockCurrentCampaign({ campaignId: 'foobar', isLive: true })
    )
    await getCampaign()
    expect(callRedis).toHaveBeenCalledWith({
      operation: 'GET',
      key: 'campaign:foobar:newUsers',
    })
  })

  it('does not call Redis when the campaign is not live', async () => {
    expect.assertions(1)
    getCurrentCampaign.mockReturnValue(
      getMockCurrentCampaign({ isLive: false })
    )
    await getCampaign()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('logs an error if Redis throws and return null for Redis items', async () => {
    expect.assertions(1)
    callRedis.mockRejectedValue('Uh, Redis seems to be out at the moment.')
    await getCampaign()
    expect(logger.error).toHaveBeenCalledWith(
      'Uh, Redis seems to be out at the moment.'
    )
  })

  it('return null for Redis items if Redis throws', async () => {
    expect.assertions(1)
    callRedis.mockRejectedValue('Uh, Redis seems to be out at the moment.')
    expect(await getCampaign()).toMatchObject({
      numNewUsers: null,
    })
  })

  it('returns the expected data', async () => {
    expect.assertions(1)
    getCurrentCampaign.mockReturnValue(
      getMockCurrentCampaign({ campaignId: 'foobar', isLive: true })
    )
    callRedis.mockResolvedValue(3151)
    expect(await getCampaign()).toEqual({
      campaignId: 'foobar',
      isLive: true,
      numNewUsers: 3151,
    })
  })
})
