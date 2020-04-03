/* eslint-env jest */
import moment from 'moment'
import MockDate from 'mockdate'
import { getMockUserContext } from '../../test-utils'

jest.mock('../getCurrentCampaignConfig')

beforeEach(() => {
  const mockNow = '2017-05-19T13:59:58.000Z'
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  jest.clearAllMocks()
})

// See createCampaignConfiguration.test.js.
const getMockCampaignConfiguration = () => ({
  addMoneyRaised: jest.fn(),
  campaignId: 'myCoolCampaign',
  content: {
    titleMarkdown: '## Some title',
    descriptionMarkdown: '#### A description goes here.',
  },
  getCharityData: jest.fn(() =>
    Promise.resolve({
      id: 'some-charity-id',
      image: 'https://cdn.example.com/some-image.jpg',
      imageCaption: null,
      impact: 'This is what we show after a user donates hearts.',
      name: 'Some Charity',
      vcReceived: 9876543,
      website: 'https://foo.com',
    })
  ),
  goal: {
    getCurrentNumber: jest.fn(() => Promise.resolve(112358)),
    impactUnitSingular: 'Heart',
    impactUnitPlural: 'Hearts',
    impactVerbPastTense: 'raised',
    limitProgressToTargetMax: false,
    targetNumber: 10e6,
  },
  incrementNewUserCount: jest.fn(),
  incrementTabCount: jest.fn(),
  get isLive() {
    return true
  },
  showCountdownTimer: true,
  showHeartsDonationButton: true,
  showProgressBar: true,
  theme: {
    color: {
      main: '#ff7314',
      light: '#f6924e',
    },
  },
  time: {
    start: '2020-05-01T18:00:00.000Z',
    end: '2020-05-05T18:00:00.000Z',
  },
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('getCampaign', () => {
  it('returns the expected data', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    getCurrentCampaignConfig.mockReturnValue(getMockCampaignConfiguration())
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    expect(campaign).toEqual({
      addMoneyRaised: expect.any(Function),
      campaignId: 'myCoolCampaign',
      charity: {
        id: 'some-charity-id',
        image: 'https://cdn.example.com/some-image.jpg',
        imageCaption: null,
        impact: 'This is what we show after a user donates hearts.',
        name: 'Some Charity',
        vcReceived: 9876543,
        website: 'https://foo.com',
      },
      content: {
        titleMarkdown: '## Some title',
        descriptionMarkdown: '#### A description goes here.',
      },
      goal: {
        currentNumber: 112358,
        impactUnitSingular: 'Heart',
        impactUnitPlural: 'Hearts',
        impactVerbPastTense: 'raised',
        limitProgressToTargetMax: false,
        targetNumber: 10e6,
      },
      incrementNewUserCount: expect.any(Function),
      incrementTabCount: expect.any(Function),
      isLive: true,
      showCountdownTimer: true,
      showHeartsDonationButton: true,
      showProgressBar: true,
      theme: {
        color: {
          main: '#ff7314',
          light: '#f6924e',
        },
      },
      time: {
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-05T18:00:00.000Z',
      },
    })
  })

  it('does not include a "charity" value if getCharityData returns null', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue({
      ...mockCampaignConfig,
      getCharityData: jest.fn(() => Promise.resolve(null)),
    })
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    expect(campaign.charity).toBeUndefined()
  })

  it('does not include a "goal" value if goal is not defined in the campaign config', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue({
      ...mockCampaignConfig,
      goal: undefined,
    })
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    expect(campaign.goal).toBeUndefined()
  })
})
