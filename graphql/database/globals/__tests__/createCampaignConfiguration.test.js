/* eslint-env jest */
import moment from 'moment'
import MockDate from 'mockdate'
import createCampaignConfiguration from '../createCampaignConfiguration'
import callRedis from '../../../utils/redis'
import CharityModel from '../../charities/CharityModel'
import { getMockUserContext } from '../../test-utils'

jest.mock('../../../utils/redis')
jest.mock('../../charities/CharityModel')
jest.mock('../../../utils/logger')

const mockNow = '2020-05-02T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  jest.clearAllMocks()
  MockDate.reset()
  CharityModel.get.mockReturnValue(null)
})

// Get an example of campaign config input.
const getMockCampaignConfigInput = () => ({
  campaignId: 'myCoolCampaign',
  charityId: '5ae19457-a8a7-4c28-89ee-52179a2fb966',
  content: {
    titleMarkdown: '## Some title',
    descriptionMarkdown: '#### A description goes here.',
  },
  countNewUsers: true,
  countTabsOpened: true,
  endContent: {
    titleMarkdown: '## Another title',
    descriptionMarkdown: '#### Another description goes here.',
  },
  goal: {
    impactUnitSingular: 'Heart',
    impactUnitPlural: 'Hearts',
    impactVerbPastTense: 'raised',
    targetNumber: 10e6,
  },
  showCountdownTimer: true,
  showHeartsDonationButton: true,
  showProgressBar: true,
  time: {
    start: '2020-05-01T18:00:00.000Z',
    end: '2020-05-05T18:00:00.000Z',
  },
})

describe('createCampaignConfiguration', () => {
  it('returns an object with the expected required properties', () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(createCampaignConfiguration(mockCampaignInput)).toEqual({
      campaignId: 'myCoolCampaign',
      content: {
        titleMarkdown: '## Some title',
        descriptionMarkdown: '#### A description goes here.',
      },
      endContent: {
        titleMarkdown: '## Another title',
        descriptionMarkdown: '#### Another description goes here.',
      },
      getCharityData: expect.any(Function),
      goal: {
        getCurrentNumber: expect.any(Function),
        impactUnitSingular: 'Heart',
        impactUnitPlural: 'Hearts',
        impactVerbPastTense: 'raised',
        targetNumber: 10e6,
      },
      incrementNewUserCount: expect.any(Function),
      incrementTabCount: expect.any(Function),
      isActive: expect.any(Function),
      showCountdownTimer: true,
      showHeartsDonationButton: true,
      showProgressBar: true,
      time: {
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-05T18:00:00.000Z',
      },
    })
  })

  it('calls Redis as expected when calling incrementNewUserCount and countNewUsers is true', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countNewUsers: true,
    })
    await campaignConfig.incrementNewUserCount()
    expect(callRedis).toHaveBeenCalledWith({
      operation: 'INCR',
      key: 'campaign:myFunCampaign:newUsers',
    })
  })

  it('does not call Redis when calling incrementNewUserCount and countNewUsers is false', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countNewUsers: false,
    })
    await campaignConfig.incrementNewUserCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('does not call Redis when calling incrementNewUserCount and the campaign is no longer active', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countNewUsers: true,
      time: {
        ...mockCampaignInput.time,
        start: '2020-04-21T18:00:00.000Z',
        end: '2020-04-28T18:00:00.000Z', // campaign has ended
      },
    })
    await campaignConfig.incrementNewUserCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('calls Redis as expected when calling incrementTabCount and countTabsOpened is true', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countTabsOpened: true,
    })
    await campaignConfig.incrementTabCount()
    expect(callRedis).toHaveBeenCalledWith({
      operation: 'INCR',
      key: 'campaign:myFunCampaign:tabsOpened',
    })
  })

  it('does not call Redis when calling incrementTabCount and countTabsOpened is false', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countTabsOpened: false,
    })
    await campaignConfig.incrementTabCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('does not call Redis when calling incrementTabCount and the campaign is no longer active', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countTabsOpened: true,
      time: {
        ...mockCampaignInput.time,
        start: '2020-04-21T18:00:00.000Z',
        end: '2020-04-28T18:00:00.000Z', // campaign has ended
      },
    })
    await campaignConfig.incrementTabCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('fetches the charity as expected when calling getCharityData', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      charityId: 'some-charity-id',
    })
    const mockUserContext = getMockUserContext()
    await campaignConfig.getCharityData(mockUserContext)
    expect(CharityModel.get).toHaveBeenCalledWith(
      mockUserContext,
      'some-charity-id'
    )
  })

  it('returns the expected charity data when calling getCharityData', async () => {
    expect.assertions(1)
    CharityModel.get.mockReturnValue({
      id: 'some-charity-id',
      foo: 'bar',
    })
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      charityId: 'some-charity-id',
    })
    const mockUserContext = getMockUserContext()
    const charityData = await campaignConfig.getCharityData(mockUserContext)
    expect(charityData).toEqual({
      id: 'some-charity-id',
      foo: 'bar',
    })
  })

  it('returns null charity data when no charityId is defined in the config', async () => {
    expect.assertions(1)
    CharityModel.get.mockReturnValue({
      id: 'some-charity-id',
      foo: 'bar',
    })
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      charityId: null, // no charity ID defined
    })
    const mockUserContext = getMockUserContext()
    const charityData = await campaignConfig.getCharityData(mockUserContext)
    expect(charityData).toBeNull()
  })

  it('throws if fetching the charity thows', async () => {
    expect.assertions(1)
    const mockErr = new Error('The database has failed us.')
    CharityModel.get.mockImplementation(() => {
      throw mockErr
    })
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      charityId: 'some-charity-id',
    })
    const mockUserContext = getMockUserContext()
    await expect(
      campaignConfig.getCharityData(mockUserContext)
    ).rejects.toEqual(mockErr)
  })

  it('isActive() returns true if the campaign is still active', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countTabsOpened: true,
      time: {
        ...mockCampaignInput.time,
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-05T18:00:00.000Z', // campaign is still active
      },
    })
    expect(campaignConfig.isActive()).toBe(true)
  })

  it('isActive() returns false if the campaign is no longer active', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countTabsOpened: true,
      time: {
        ...mockCampaignInput.time,
        start: '2020-04-21T18:00:00.000Z',
        end: '2020-04-28T18:00:00.000Z', // campaign has ended
      },
    })
    expect(campaignConfig.isActive()).toBe(false)
  })
})
