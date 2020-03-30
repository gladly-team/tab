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
  campaignId: 'myCoolCampaign',
  content: {
    titleMarkdown: '## Some title',
    descriptionMarkdown: '#### A description goes here.',
  },
  endContent: {
    titleMarkdown: '## Another title',
    descriptionMarkdown: '#### Another description goes here.',
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
    targetNumber: 10e6,
  },
  incrementNewUserCount: jest.fn(),
  incrementTabCount: jest.fn(),
  isActive: jest.fn(),
  showCountdownTimer: true,
  showHeartsDonationButton: true,
  showProgressBar: true,
  time: {
    start: '2020-05-01T18:00:00.000Z',
    end: '2020-05-05T18:00:00.000Z',
  },
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('getCampaign', () => {
  it('is a placeholder', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    getCurrentCampaignConfig.mockReturnValue(getMockCampaignConfiguration())
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    expect(campaign).toEqual({
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
      endContent: {
        titleMarkdown: '## Another title',
        descriptionMarkdown: '#### Another description goes here.',
      },
      goal: {
        currentNumber: 112358,
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
})
