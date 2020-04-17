/* eslint-env jest */
import moment from 'moment'
import { get } from 'lodash/object'
import MockDate from 'mockdate'
import { getMockUserContext } from '../../test-utils'

jest.mock('../getCurrentCampaignConfig')

beforeEach(() => {
  const mockNow = '2020-05-04T12:00:00.000Z'
  MockDate.set(moment(mockNow))
  process.env.CAMPAIGN_END_OVERRIDE = undefined
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
    descriptionMarkdownTwo: '#### Other optional text here.',
  },
  endTriggers: {
    whenGoalAchieved: false,
    whenTimeEnds: true,
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
    impactVerbPastParticiple: 'raised',
    impactVerbPastTense: 'raised',
    limitProgressToTargetMax: false,
    showProgressBarLabel: true,
    showProgressBarEndText: false,
    targetNumber: 10e6,
  },
  incrementNewUserCount: jest.fn(),
  incrementTabCount: jest.fn(),
  get isLive() {
    return true
  },
  onEnd: {
    content: {
      titleMarkdown: '## The end title',
      descriptionMarkdown: '#### The end description goes here.',
      descriptionMarkdownTwo: '#### Other optional end text here.',
    },
    goal: {
      showProgressBarLabel: false,
      showProgressBarEndText: true,
    },
    showSocialSharing: true,
    socialSharing: {
      url: 'https://example.com/something-else/',
      EmailShareButtonProps: {
        subject: 'Things have ended',
        body: 'This is a way we say, "the end".',
      },
      FacebookShareButtonProps: {
        quote: 'Things have ended, and here is my post!',
      },
      RedditShareButtonProps: {
        title: 'Things have ended, and here is my post!',
      },
      TumblrShareButtonProps: {
        title: 'Things have ended',
        caption: 'This is a way we say, "the end".',
      },
      TwitterShareButtonProps: {
        title: 'Things have ended, and here is my post!',
        related: ['@TabForACause'],
      },
    },
  },
  showCountdownTimer: true,
  showHeartsDonationButton: true,
  showProgressBar: true,
  showSocialSharing: true,
  socialSharing: {
    url: 'https://example.com/share-me/',
    EmailShareButtonProps: {
      subject: 'Hi there',
      body: 'This is where we say stuff!',
    },
    FacebookShareButtonProps: {
      quote: 'This is my Facebook post text.',
    },
    RedditShareButtonProps: {
      title: 'This is the title of the Reddit post.',
    },
    TumblrShareButtonProps: {
      title: 'My Tumblr post title',
      caption: 'This is where we say stuff!',
    },
    TwitterShareButtonProps: {
      title: 'This is my Twitter post title',
      related: ['@TabForACause'],
    },
  },
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

describe('getCampaign', () => {
  it('returns the expected data when the campaign has not ended', async () => {
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
        descriptionMarkdownTwo: '#### Other optional text here.',
      },
      goal: {
        currentNumber: 112358,
        impactUnitSingular: 'Heart',
        impactUnitPlural: 'Hearts',
        impactVerbPastParticiple: 'raised',
        impactVerbPastTense: 'raised',
        limitProgressToTargetMax: false,
        showProgressBarLabel: true,
        showProgressBarEndText: false,
        targetNumber: 10e6,
      },
      incrementNewUserCount: expect.any(Function),
      incrementTabCount: expect.any(Function),
      isLive: true,
      showCountdownTimer: true,
      showHeartsDonationButton: true,
      showProgressBar: true,
      showSocialSharing: true,
      socialSharing: {
        url: 'https://example.com/share-me/',
        EmailShareButtonProps: {
          subject: 'Hi there',
          body: 'This is where we say stuff!',
        },
        FacebookShareButtonProps: {
          quote: 'This is my Facebook post text.',
        },
        RedditShareButtonProps: {
          title: 'This is the title of the Reddit post.',
        },
        TumblrShareButtonProps: {
          title: 'My Tumblr post title',
          caption: 'This is where we say stuff!',
        },
        TwitterShareButtonProps: {
          title: 'This is my Twitter post title',
          related: ['@TabForACause'],
        },
      },
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

  it('uses "onEnd" config values if the campaign has ended due to "endTriggers.whenTimeEnds"', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue({
      ...mockCampaignConfig,
      endTriggers: {
        ...get(mockCampaignConfig, 'endTriggers', {}),
        whenGoalAchieved: false,
        whenTimeEnds: true,
      },
      goal: {
        getCurrentNumber: jest.fn(() => Promise.resolve(112358)),
        impactUnitSingular: 'Heart',
        impactUnitPlural: 'Hearts',
        impactVerbPastTense: 'raised',
        limitProgressToTargetMax: false,
        showProgressBarLabel: true,
        showProgressBarEndText: false,
        targetNumber: 10e6,
      },
      onEnd: {
        ...get(mockCampaignConfig, 'onEnd', {}),
        content: {
          ...get(mockCampaignConfig, 'onEnd.content', {}),
          titleMarkdown: '## The end title',
          descriptionMarkdown: '#### The end description goes here.',
          descriptionMarkdownTwo: '#### Other optional end text here.',
        },
        goal: {
          ...get(mockCampaignConfig, 'onEnd.goal', {}),
          impactUnitSingular: 'Heart!',
          impactUnitPlural: 'Hearts!',
          showProgressBarLabel: false,
          showProgressBarEndText: true,
          showSocialSharing: true,
          socialSharing: {
            url: 'https://example.com/something-else/',
            EmailShareButtonProps: {
              subject: 'Things have ended',
              body: 'This is a way we say, "the end".',
            },
            FacebookShareButtonProps: {
              quote: 'Things have ended, and here is my post!',
            },
            RedditShareButtonProps: {
              title: 'Things have ended, and here is my post!',
            },
            TumblrShareButtonProps: {
              title: 'Things have ended',
              caption: 'This is a way we say, "the end".',
            },
            TwitterShareButtonProps: {
              title: 'Things have ended, and here is my post!',
              related: ['@TabForACause'],
            },
          },
        },
        showCountdownTimer: false,
        showHeartsDonationButton: false,
        showProgressBar: false,
        theme: {
          ...get(mockCampaignConfig, 'onEnd.theme', {}),
          color: {
            ...get(mockCampaignConfig, 'onEnd.theme.color', {}),
            main: '#000',
            light: '#FFF',
          },
        },
      },
      time: {
        ...get(mockCampaignConfig, 'time', {}),
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-03T18:00:00.000Z', // has ended
      },
    })
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    expect(campaign).toMatchObject({
      content: {
        titleMarkdown: '## The end title',
        descriptionMarkdown: '#### The end description goes here.',
        descriptionMarkdownTwo: '#### Other optional end text here.',
      },
      goal: {
        currentNumber: 112358,
        impactUnitSingular: 'Heart!', // modified
        impactUnitPlural: 'Hearts!', // modified
        impactVerbPastTense: 'raised',
        limitProgressToTargetMax: false,
        showProgressBarLabel: false, // modified
        showProgressBarEndText: true, // modified
        targetNumber: 10e6,
      },
      showCountdownTimer: false, // modified
      showHeartsDonationButton: false, // modified
      showProgressBar: false, // modified
      showSocialSharing: true,
      socialSharing: {
        url: 'https://example.com/something-else/',
        EmailShareButtonProps: {
          subject: 'Things have ended',
          body: 'This is a way we say, "the end".',
        },
        FacebookShareButtonProps: {
          quote: 'Things have ended, and here is my post!',
        },
        RedditShareButtonProps: {
          title: 'Things have ended, and here is my post!',
        },
        TumblrShareButtonProps: {
          title: 'Things have ended',
          caption: 'This is a way we say, "the end".',
        },
        TwitterShareButtonProps: {
          title: 'Things have ended, and here is my post!',
          related: ['@TabForACause'],
        },
      },
      theme: {
        color: {
          main: '#000', // modified
          light: '#FFF', // modified
        },
      },
    })
  })

  it('uses "onEnd" config values if the campaign has ended due to "endTriggers.whenGoalAchieved"', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue({
      ...mockCampaignConfig,
      goal: {
        ...get(mockCampaignConfig, 'goal', {}),
        getCurrentNumber: jest.fn(() => Promise.resolve(100)), // goal achieved
        impactUnitSingular: 'Heart',
        impactUnitPlural: 'Hearts',
        impactVerbPastTense: 'raised',
        limitProgressToTargetMax: false,
        showProgressBarLabel: true,
        showProgressBarEndText: false,
        targetNumber: 100, // goal achieved
      },
      endTriggers: {
        ...get(mockCampaignConfig, 'endTriggers', {}),
        whenGoalAchieved: true,
        whenTimeEnds: false,
      },
      onEnd: {
        ...get(mockCampaignConfig, 'onEnd', {}),
        content: {
          ...get(mockCampaignConfig, 'onEnd.content', {}),
          titleMarkdown: '## The end title',
          descriptionMarkdown: '#### The end description goes here.',
        },
        goal: {
          showProgressBarLabel: false, // modified
          showProgressBarEndText: true, // modified
        },
        showSocialSharing: true,
        socialSharing: {
          url: 'https://example.com/something-else/',
          EmailShareButtonProps: {
            subject: 'Things have ended',
            body: 'This is a way we say, "the end".',
          },
          FacebookShareButtonProps: {
            quote: 'Things have ended, and here is my post!',
          },
          RedditShareButtonProps: {
            title: 'Things have ended, and here is my post!',
          },
          TumblrShareButtonProps: {
            title: 'Things have ended',
            caption: 'This is a way we say, "the end".',
          },
          TwitterShareButtonProps: {
            title: 'Things have ended, and here is my post!',
            related: ['@TabForACause'],
          },
        },
      },
      time: {
        ...get(mockCampaignConfig, 'time', {}),
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-05T18:00:00.000Z',
      },
    })
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    expect(campaign).toMatchObject({
      content: {
        titleMarkdown: '## The end title',
        descriptionMarkdown: '#### The end description goes here.',
      },
      goal: {
        currentNumber: 100,
        impactUnitSingular: 'Heart',
        impactUnitPlural: 'Hearts',
        impactVerbPastTense: 'raised',
        limitProgressToTargetMax: false,
        showProgressBarLabel: false, // modified
        showProgressBarEndText: true, // modified
        targetNumber: 100,
      },
      showSocialSharing: true,
      socialSharing: {
        url: 'https://example.com/something-else/',
        EmailShareButtonProps: {
          subject: 'Things have ended',
          body: 'This is a way we say, "the end".',
        },
        FacebookShareButtonProps: {
          quote: 'Things have ended, and here is my post!',
        },
        RedditShareButtonProps: {
          title: 'Things have ended, and here is my post!',
        },
        TumblrShareButtonProps: {
          title: 'Things have ended',
          caption: 'This is a way we say, "the end".',
        },
        TwitterShareButtonProps: {
          title: 'Things have ended, and here is my post!',
          related: ['@TabForACause'],
        },
      },
    })
  })

  it('uses the "onEnd" config values if process.env.CAMPAIGN_END_OVERRIDE === "true"', async () => {
    expect.assertions(1)
    process.env.CAMPAIGN_END_OVERRIDE = 'true' // override
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue({
      ...mockCampaignConfig,
      endTriggers: {
        ...get(mockCampaignConfig, 'endTriggers', {}),
        whenGoalAchieved: false,
        whenTimeEnds: false,
      },
      onEnd: {
        ...get(mockCampaignConfig, 'onEnd', {}),
        content: {
          ...get(mockCampaignConfig, 'onEnd.content', {}),
          titleMarkdown: '## The end title',
          descriptionMarkdown: '#### The end description goes here.',
        },
      },
      time: {
        ...get(mockCampaignConfig, 'time', {}),
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-05T18:00:00.000Z',
      },
    })
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    expect(campaign).toMatchObject({
      content: {
        // Switched to the end content.
        titleMarkdown: '## The end title',
        descriptionMarkdown: '#### The end description goes here.',
      },
    })
  })

  it('does NOT use "onEnd" config values if process.env.CAMPAIGN_END_OVERRIDE === "false"', async () => {
    expect.assertions(1)
    process.env.CAMPAIGN_END_OVERRIDE = 'false' // no override
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue({
      ...mockCampaignConfig,
      endTriggers: {
        ...get(mockCampaignConfig, 'endTriggers', {}),
        whenGoalAchieved: false,
        whenTimeEnds: false,
      },
      onEnd: {
        ...get(mockCampaignConfig, 'onEnd', {}),
        content: {
          ...get(mockCampaignConfig, 'onEnd.content', {}),
          titleMarkdown: '## The end title',
          descriptionMarkdown: '#### The end description goes here.',
        },
      },
      time: {
        ...get(mockCampaignConfig, 'time', {}),
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-05T18:00:00.000Z',
      },
    })
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    expect(campaign).toMatchObject({
      content: {
        // Has not switched to the end content.
        titleMarkdown: '## Some title',
        descriptionMarkdown: '#### A description goes here.',
      },
    })
  })

  it('does NOT use "onEnd" config values if the campaign has NOT ended with "endTriggers.whenTimeEnds"', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue({
      ...mockCampaignConfig,
      endTriggers: {
        ...get(mockCampaignConfig, 'endTriggers', {}),
        whenGoalAchieved: false,
        whenTimeEnds: true,
      },
      onEnd: {
        ...get(mockCampaignConfig, 'onEnd', {}),
        content: {
          ...get(mockCampaignConfig, 'onEnd.content', {}),
          titleMarkdown: '## The end title',
          descriptionMarkdown: '#### The end description goes here.',
        },
      },
      time: {
        ...get(mockCampaignConfig, 'time', {}),
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-05T18:00:00.000Z', // has NOT ended
      },
    })
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    expect(campaign).toMatchObject({
      content: {
        // Has not switched to the end content.
        titleMarkdown: '## Some title',
        descriptionMarkdown: '#### A description goes here.',
      },
    })
  })

  it('does NOT use "onEnd" config values if the campaign has NOT ended with "endTriggers.whenGoalAchieved"', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue({
      ...mockCampaignConfig,
      goal: {
        getCurrentNumber: jest.fn(() => Promise.resolve(99)), // goal NOT achieved
        impactUnitSingular: 'Heart',
        impactUnitPlural: 'Hearts',
        impactVerbPastTense: 'raised',
        limitProgressToTargetMax: false,
        targetNumber: 100, // goal NOT achieved
      },
      endTriggers: {
        whenGoalAchieved: true,
        whenTimeEnds: false,
      },
      onEnd: {
        content: {
          titleMarkdown: '## The end title',
          descriptionMarkdown: '#### The end description goes here.',
        },
      },
      time: {
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-05T18:00:00.000Z',
      },
    })
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    expect(campaign).toMatchObject({
      content: {
        // Has not switched to the end content.
        titleMarkdown: '## Some title',
        descriptionMarkdown: '#### A description goes here.',
      },
    })
  })

  it('calls the campaign config\'s "addMoneyRaised" when the campaign has not ended', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue(mockCampaignConfig)
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    campaign.addMoneyRaised(0.02)
    expect(mockCampaignConfig.addMoneyRaised).toHaveBeenCalled()
  })

  it('calls the campaign config\'s "incrementNewUserCount" when the campaign has not ended', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue(mockCampaignConfig)
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    campaign.incrementNewUserCount(0.02)
    expect(mockCampaignConfig.incrementNewUserCount).toHaveBeenCalled()
  })

  it('calls the campaign config\'s "incrementTabCount" when the campaign has not ended', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue(mockCampaignConfig)
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    campaign.incrementTabCount(0.02)
    expect(mockCampaignConfig.incrementTabCount).toHaveBeenCalled()
  })

  it('does NOT call the campaign config\'s "addMoneyRaised" when the campaign has ended', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue({
      ...mockCampaignConfig,
      endTriggers: {
        ...get(mockCampaignConfig, 'endTriggers', {}),
        whenGoalAchieved: false,
        whenTimeEnds: true,
      },
      onEnd: {
        ...get(mockCampaignConfig, 'onEnd', {}),
        content: {
          ...get(mockCampaignConfig, 'onEnd.content', {}),
          titleMarkdown: '## The end title',
          descriptionMarkdown: '#### The end description goes here.',
        },
      },
      time: {
        ...get(mockCampaignConfig, 'time', {}),
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-03T18:00:00.000Z', // has ended
      },
    })
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    campaign.addMoneyRaised(0.02)
    expect(mockCampaignConfig.addMoneyRaised).not.toHaveBeenCalled()
  })

  it('does NOT call the campaign config\'s "incrementNewUserCount" when the campaign has ended', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue({
      ...mockCampaignConfig,
      endTriggers: {
        ...get(mockCampaignConfig, 'endTriggers', {}),
        whenGoalAchieved: false,
        whenTimeEnds: true,
      },
      onEnd: {
        ...get(mockCampaignConfig, 'onEnd', {}),
        content: {
          ...get(mockCampaignConfig, 'onEnd.content', {}),
          titleMarkdown: '## The end title',
          descriptionMarkdown: '#### The end description goes here.',
        },
      },
      time: {
        ...get(mockCampaignConfig, 'time', {}),
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-03T18:00:00.000Z', // has ended
      },
    })
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    campaign.incrementNewUserCount()
    expect(mockCampaignConfig.incrementNewUserCount).not.toHaveBeenCalled()
  })

  it('does NOT call the campaign config\'s "incrementTabCount" when the campaign has ended', async () => {
    expect.assertions(1)
    const getCurrentCampaignConfig = require('../getCurrentCampaignConfig')
      .default
    const mockCampaignConfig = getMockCampaignConfiguration()
    getCurrentCampaignConfig.mockReturnValue({
      ...mockCampaignConfig,
      endTriggers: {
        ...get(mockCampaignConfig, 'endTriggers', {}),
        whenGoalAchieved: false,
        whenTimeEnds: true,
      },
      onEnd: {
        ...get(mockCampaignConfig, 'onEnd', {}),
        content: {
          ...get(mockCampaignConfig, 'onEnd.content', {}),
          titleMarkdown: '## The end title',
          descriptionMarkdown: '#### The end description goes here.',
        },
      },
      time: {
        ...get(mockCampaignConfig, 'time', {}),
        start: '2020-05-01T18:00:00.000Z',
        end: '2020-05-03T18:00:00.000Z', // has ended
      },
    })
    const mockUserContext = getMockUserContext()
    const getCampaign = require('../getCampaign').default
    const campaign = await getCampaign(mockUserContext)
    campaign.incrementTabCount()
    expect(mockCampaignConfig.incrementTabCount).not.toHaveBeenCalled()
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
