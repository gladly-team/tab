/* eslint-env jest */
import createCampaignConfiguration from '../createCampaignConfiguration'
// import callRedis from '../../utils/redis'
// import CharityModel from '../charities/CharityModel'
// import logger from '../../utils/logger'

jest.mock('../../../utils/redis')
jest.mock('../../charities/CharityModel')
jest.mock('../../../utils/logger')

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
})
