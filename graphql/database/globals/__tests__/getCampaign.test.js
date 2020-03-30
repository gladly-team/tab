/* eslint-env jest */
import moment from 'moment'
import MockDate from 'mockdate'
import createCampaignConfiguration from '../createCampaignConfiguration'

jest.mock('../getCurrentCampaignConfig')

beforeEach(() => {
  const mockNow = '2017-05-19T13:59:58.000Z'
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  jest.clearAllMocks()
})

// From createCampaignConfiguration.test.js.
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
    numberSource: 'hearts',
    targetNumber: 10e6,
    transformNumberSourceValue: undefined, // optional function
  },
  showCountdownTimer: true,
  showHeartsDonationButton: true,
  showProgressBar: true,
  time: {
    start: '2020-05-01T18:00:00.000Z',
    end: '2020-05-05T18:00:00.000Z',
  },
})

const getMockCampaignConfiguration = () => {
  return createCampaignConfiguration(getMockCampaignConfigInput())
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('getCampaign', () => {
  it('is a placeholder', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    getCurrentCampaignConfig.mockReturnValue(getMockCampaignConfiguration())
    const getCampaign = require('../getCampaign').default
    getCampaign()
    expect(true).toBe(true)
  })
})
