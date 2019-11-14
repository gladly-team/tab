/* eslint-env jest */
import moment from 'moment'
import MockDate from 'mockdate'
import getCampaign, { getCampaignObject } from '../getCampaign'
import { getCurrentCampaignHardcodedData } from '../hardcodedCampaignData'
import callRedis from '../../../utils/redis'
import logger from '../../../utils/logger'

const mockNow = '2017-05-19T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))
  process.env.IS_GLOBAL_CAMPAIGN_LIVE = false
})

afterEach(() => {
  MockDate.reset()
})

jest.mock('../hardcodedCampaignData')
jest.mock('../../../utils/redis')
jest.mock('../../../utils/logger')

const getMockHardcodedCampaignInfo = ({
  campaignId = 'someCampaign',
  ...otherProps
} = {}) => ({
  campaignId,
  isLive: true,
  time: {
    start: '2019-11-12T10:00:00.000Z',
    end: '2020-01-10T20:00:00.000Z',
  },
  ...otherProps,
})

beforeEach(() => {
  getCurrentCampaignHardcodedData.mockReturnValue(
    getMockHardcodedCampaignInfo()
  )
  callRedis.mockResolvedValue(28)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('getCampaign', () => {
  it('returns an object with the correct campaign ID', async () => {
    expect.assertions(1)
    getCurrentCampaignHardcodedData.mockReturnValue(
      getMockHardcodedCampaignInfo({ campaignId: 'someCampaignIdHere' })
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
    getCurrentCampaignHardcodedData.mockReturnValue(
      getMockHardcodedCampaignInfo({
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
    getCurrentCampaignHardcodedData.mockReturnValue(
      getMockHardcodedCampaignInfo({
        campaignId: 'someCampaignIdHere',
        isLive: false,
      })
    )
    expect((await getCampaign()).id).toBeUndefined()
  })

  it('calls Redis to get the "numNewUsers" value when the campaign is live', async () => {
    expect.assertions(1)
    getCurrentCampaignHardcodedData.mockReturnValue(
      getMockHardcodedCampaignInfo({ campaignId: 'foobar', isLive: true })
    )
    await getCampaign()
    expect(callRedis).toHaveBeenCalledWith({
      operation: 'GET',
      key: 'campaign:foobar:newUsers',
    })
  })

  it('does not call Redis when the campaign is not live', async () => {
    expect.assertions(1)
    getCurrentCampaignHardcodedData.mockReturnValue(
      getMockHardcodedCampaignInfo({ isLive: false })
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

  it('return expected defaults for Redis items if Redis throws', async () => {
    expect.assertions(1)
    callRedis.mockRejectedValue('Uh, Redis seems to be out at the moment.')
    expect(await getCampaign()).toMatchObject({
      numNewUsers: 0,
    })
  })

  it('return zero "numNewUsers" if Redis returns null', async () => {
    expect.assertions(1)
    callRedis.mockResolvedValue(null)
    expect(await getCampaign()).toMatchObject({
      numNewUsers: 0,
    })
  })

  it('return zero "numNewUsers" if Redis returns undefined', async () => {
    expect.assertions(1)
    callRedis.mockResolvedValue(undefined)
    expect(await getCampaign()).toMatchObject({
      numNewUsers: 0,
    })
  })

  it('returns the expected data', async () => {
    expect.assertions(1)
    getCurrentCampaignHardcodedData.mockReturnValue(
      getMockHardcodedCampaignInfo({ campaignId: 'foobar', isLive: true })
    )
    callRedis.mockResolvedValue(3151)
    expect(await getCampaign()).toEqual({
      campaignId: 'foobar',
      isLive: true,
      numNewUsers: 3151,
    })
  })
})

describe('getCampaignObject', () => {
  it('returns an object with the expected properties', () => {
    expect.assertions(1)
    expect(getCampaignObject()).toEqual({
      campaignId: expect.any(String),
      isLive: expect.any(Boolean),
      getNewUsersRedisKey: expect.any(Function),
      isActive: expect.any(Function),
    })
  })

  it('creates the expected string when calling getNewUsersRedisKey', () => {
    expect.assertions(1)
    const campaign = getCampaignObject()
    expect(campaign.getNewUsersRedisKey()).toEqual(
      `campaign:${campaign.campaignId}:newUsers`
    )
  })

  it("returns true from the isActive method when the current time is between the campaign's start and end times", () => {
    expect.assertions(1)
    MockDate.set(moment('2019-11-28T17:45:00.000Z'))
    getCurrentCampaignHardcodedData.mockReturnValue(
      getMockHardcodedCampaignInfo({
        campaignId: 'hello',
        isLive: true,
        time: {
          start: '2019-11-12T10:00:00.000Z',
          end: '2020-01-10T20:00:00.000Z',
        },
      })
    )
    const campaign = getCampaignObject()
    expect(campaign.isActive()).toBe(true)
  })

  it("returns false from the isActive method when the current time is before the campaign's start time", () => {
    expect.assertions(1)
    MockDate.set(moment('2019-10-02T17:45:00.000Z'))
    getCurrentCampaignHardcodedData.mockReturnValue(
      getMockHardcodedCampaignInfo({
        campaignId: 'hello',
        isLive: true,
        time: {
          start: '2019-11-12T10:00:00.000Z',
          end: '2020-01-10T20:00:00.000Z',
        },
      })
    )
    const campaign = getCampaignObject()
    expect(campaign.isActive()).toBe(false)
  })

  it("returns false from the isActive method when the current time is after the campaign's end time", () => {
    expect.assertions(1)
    MockDate.set(moment('2020-01-11T17:45:00.000Z'))
    getCurrentCampaignHardcodedData.mockReturnValue(
      getMockHardcodedCampaignInfo({
        campaignId: 'hello',
        isLive: true,
        time: {
          start: '2019-11-12T10:00:00.000Z',
          end: '2020-01-10T20:00:00.000Z',
        },
      })
    )
    const campaign = getCampaignObject()
    expect(campaign.isActive()).toBe(false)
  })
})
