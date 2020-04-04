/* eslint-env jest */
import moment from 'moment'
import MockDate from 'mockdate'
import createCampaignConfiguration from '../createCampaignConfiguration'
import callRedis from '../../../utils/redis'
import CharityModel from '../../charities/CharityModel'
import getCharityVcReceived from '../../donations/getCharityVcReceived'
import { getMockUserContext } from '../../test-utils'

jest.mock('../../../utils/redis')
jest.mock('../../charities/CharityModel')
jest.mock('../../donations/getCharityVcReceived')
jest.mock('../../../utils/logger')

const mockNow = '2020-05-02T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))
  process.env.IS_GLOBAL_CAMPAIGN_LIVE = true
})

afterEach(() => {
  jest.clearAllMocks()
  MockDate.reset()
  CharityModel.get.mockReturnValue(null)
  callRedis.mockResolvedValue(null)
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
  countMoneyRaised: true,
  countTabsOpened: true,
  endTriggers: {
    whenGoalAchieved: false,
    whenTimeEnds: true,
  },
  goal: {
    impactUnitSingular: 'Heart',
    impactUnitPlural: 'Hearts',
    impactVerbPastParticiple: 'raised',
    impactVerbPastTense: 'raised',
    limitProgressToTargetMax: false,
    numberSource: 'hearts',
    showProgressBarLabel: true,
    showProgressBarEndText: false,
    targetNumber: 10e6,
    transformNumberSourceValue: undefined, // optional function
  },
  onEnd: {
    content: {
      titleMarkdown: '## The end title',
      descriptionMarkdown: '#### The end description goes here.',
    },
    showSocialSharing: true,
    socialSharing: {
      url: 'https://example.com/share-me',
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
    // ... can have other stuff here
  },
  showCountdownTimer: true,
  showHeartsDonationButton: true,
  showProgressBar: true,
  showSocialSharing: false,
  socialSharing: undefined,
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

describe('validation: general', () => {
  it('returns the expected object', () => {
    expect.assertions(1)
    process.env.IS_GLOBAL_CAMPAIGN_LIVE = true
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(createCampaignConfiguration(mockCampaignInput)).toEqual({
      addMoneyRaised: expect.any(Function),
      campaignId: 'myCoolCampaign',
      content: {
        titleMarkdown: '## Some title',
        descriptionMarkdown: '#### A description goes here.',
      },
      endTriggers: {
        whenGoalAchieved: false,
        whenTimeEnds: true,
      },
      getCharityData: expect.any(Function),
      goal: {
        getCurrentNumber: expect.any(Function),
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
      onEnd: {
        content: {
          titleMarkdown: '## The end title',
          descriptionMarkdown: '#### The end description goes here.',
        },
        showSocialSharing: true,
        socialSharing: {
          url: 'https://example.com/share-me',
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
      },
      showCountdownTimer: true,
      showHeartsDonationButton: true,
      showProgressBar: true,
      // showSocialSharing: false, // TODO
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

  it('returns isLive === false when process.env.IS_GLOBAL_CAMPAIGN_LIVE === "false"', () => {
    expect.assertions(1)
    process.env.IS_GLOBAL_CAMPAIGN_LIVE = false
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(createCampaignConfiguration(mockCampaignInput).isLive).toBe(false)
  })

  it('returns isLive === true when process.env.IS_GLOBAL_CAMPAIGN_LIVE === "true"', () => {
    expect.assertions(1)
    process.env.IS_GLOBAL_CAMPAIGN_LIVE = true
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(createCampaignConfiguration(mockCampaignInput).isLive).toBe(true)
  })

  it('throws if "campaignId" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        campaignId: undefined,
      })
    }).toThrow('Campaign config validation error: "campaignId" is required')
  })

  it('throws if "campaignId" is not a string', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        campaignId: 1234,
      })
    }).toThrow(
      'Campaign config validation error: "campaignId" must be a string'
    )
  })
})

describe('validation: charityId and showHeartsDonationButton', () => {
  it('does not throw if "charityId" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: undefined, // cannot have a goal that relies on hearts when charityId is null
        showHeartsDonationButton: false, // required when charityId is null
        showProgressBar: false, // this must be false because we set "goal" to null
        charityId: undefined,
      })
    }).not.toThrow()
  })

  it('throws if "charityId" is set to something other than a string', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        charityId: 1234,
      })
    }).toThrow('Campaign config validation error: "charityId" must be a string')
  })

  it('throws if "showHeartsDonationButton" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showHeartsDonationButton: undefined,
      })
    }).toThrow(
      'Campaign config validation error: "showHeartsDonationButton" is required'
    )
  })

  it('throws if "showHeartsDonationButton" is set to a non-boolean value', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showHeartsDonationButton: 0,
      })
    }).toThrow(
      'Campaign config validation error: "showHeartsDonationButton" must be a boolean'
    )
  })

  it('throws if "showHeartsDonationButton" is true but "charityId" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: undefined, // cannot have a goal that relies on hearts when charityId is null
        showProgressBar: false, // this must be false because we set "goal" to null
        charityId: undefined,
        showHeartsDonationButton: true,
      })
    }).toThrow('Campaign config validation error: "charityId" is required')
  })
})

describe('validation: content', () => {
  it('throws if "content" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        content: undefined,
      })
    }).toThrow('Campaign config validation error: "content" is required')
  })

  it('throws if "content.titleMarkdown" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        content: {
          titleMarkdown: undefined,
          descriptionMarkdown: '#### Something',
        },
      })
    }).toThrow(
      'Campaign config validation error: "content.titleMarkdown" is required'
    )
  })

  it('throws if "content.descriptionMarkdown" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        content: {
          titleMarkdown: '## A title',
          descriptionMarkdown: undefined,
        },
      })
    }).toThrow(
      'Campaign config validation error: "content.descriptionMarkdown" is required'
    )
  })
})

describe('validation: showCountdownTimer', () => {
  it('throws if "showCountdownTimer" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showCountdownTimer: undefined,
      })
    }).toThrow(
      'Campaign config validation error: "showCountdownTimer" is required'
    )
  })

  it('throws if "showCountdownTimer" is set to a non-boolean value', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showCountdownTimer: 0,
      })
    }).toThrow(
      'Campaign config validation error: "showCountdownTimer" must be a boolean'
    )
  })
})

describe('validation: showProgressBar and goal', () => {
  it('throws if "showProgressBar" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showProgressBar: undefined,
      })
    }).toThrow(
      'Campaign config validation error: "showProgressBar" is required'
    )
  })

  it('throws if "showProgressBar" is set to a non-boolean value', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showProgressBar: 0,
      })
    }).toThrow(
      'Campaign config validation error: "showProgressBar" must be a boolean'
    )
  })

  it('throws if "showProgressBar" is true but "goal" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: undefined,
        showProgressBar: true,
      })
    }).toThrow('Campaign config validation error: "goal" is required')
  })

  it('does not throw if "goal" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: undefined,
        showProgressBar: false, // required if a goal is not defined
      })
    }).not.toThrow()
  })

  it('throws if "goal.impactUnitSingular" is not a string', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          impactUnitSingular: undefined,
        },
      })
    }).toThrow(
      'Campaign config validation error: "goal.impactUnitSingular" is required'
    )
  })

  it('throws if "goal.impactUnitPlural" is not a string', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          impactUnitPlural: undefined,
        },
      })
    }).toThrow(
      'Campaign config validation error: "goal.impactUnitPlural" is required'
    )
  })

  it('throws if "goal.impactVerbPastTense" is not a string', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          impactVerbPastTense: undefined,
        },
      })
    }).toThrow(
      'Campaign config validation error: "goal.impactVerbPastTense" is required'
    )
  })

  it('throws if "goal.limitProgressToTargetMax" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          limitProgressToTargetMax: undefined,
        },
      })
    }).toThrow(
      'Campaign config validation error: "goal.limitProgressToTargetMax" is required'
    )
  })

  it('throws if "goal.targetNumber" is not a number', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          targetNumber: '100 thousand',
        },
      })
    }).toThrow(
      'Campaign config validation error: "goal.targetNumber" must be a number'
    )
  })

  it('does not throw if "goal.numberSource" is "hearts"', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          numberSource: 'hearts',
        },
      })
    }).not.toThrow()
  })

  it('does not throw if "goal.numberSource" is "moneyRaised"', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          numberSource: 'moneyRaised',
        },
      })
    }).not.toThrow()
  })

  it('does not throw if "goal.numberSource" is "newUsers"', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          numberSource: 'newUsers',
        },
      })
    }).not.toThrow()
  })

  it('does not throw if "goal.numberSource" is "tabsOpened"', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          numberSource: 'tabsOpened',
        },
      })
    }).not.toThrow()
  })

  it('throws if "goal.numberSource" is not one of the valid strings', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          numberSource: 'pizza',
        },
      })
    }).toThrow(
      'Campaign config validation error: "goal.numberSource" must be one of [hearts, moneyRaised, newUsers, tabsOpened]'
    )
  })

  it('throws if "goal.transformNumberSourceValue" is defined but is not a function', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          transformNumberSourceValue: 0.12,
        },
      })
    }).toThrow(
      'Campaign config validation error: "goal.transformNumberSourceValue" must be of type function'
    )
  })
})

describe('validation: socialSharing and showSocialSharing', () => {
  it('throws if "showSocialSharing" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showSocialSharing: undefined,
      })
    }).toThrow(
      'Campaign config validation error: "showSocialSharing" is required'
    )
  })

  it('throws if "showSocialSharing" is set to a non-boolean value', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        showSocialSharing: 0,
      })
    }).toThrow(
      'Campaign config validation error: "showSocialSharing" must be a boolean'
    )
  })
})

describe('validation: time', () => {
  it('throws if "time" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        time: undefined,
      })
    }).toThrow('Campaign config validation error: "time" is required')
  })

  it('throws if "time.start" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        time: {
          start: undefined,
          end: '2020-05-01T18:00:00.000Z',
        },
      })
    }).toThrow('Campaign config validation error: "time.start" is required')
  })

  it('throws if "time.start" is not a valid ISO timestamp', async () => {
    expect.assertions(1)

    // Suppress expected moment.js complaint.
    jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        time: {
          start: '2018-12-23 10am', // invalid
          end: '2020-05-01T18:00:00.000Z',
        },
      })
    }).toThrow(
      'Campaign config validation error: "time.start" must be in ISO 8601 date format'
    )
  })

  it('throws if "time.end" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        time: {
          start: '2020-05-01T18:00:00.000Z',
          end: undefined,
        },
      })
    }).toThrow('Campaign config validation error: "time.end" is required')
  })

  it('throws if "time.end" is not a valid ISO timestamp', async () => {
    expect.assertions(1)

    // Suppress expected moment.js complaint.
    jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        time: {
          start: '2020-05-01T18:00:00.000Z',
          end: '2018-12-23 10am', // invalid
        },
      })
    }).toThrow(
      'Campaign config validation error: "time.end" must be in ISO 8601 date format'
    )
  })
})

describe('validation: theme', () => {
  it('does not throw if "theme" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        theme: undefined,
      })
    }).not.toThrow()
  })

  it('does not throw if "theme" is an empty object', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        theme: {},
      })
    }).not.toThrow()
  })

  it('throws if "theme.color.main" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        theme: {
          ...mockCampaignInput.theme,
          color: {
            main: undefined,
            light: '#f6924e',
          },
        },
      })
    }).toThrow(
      'Campaign config validation error: "theme.color.main" is required'
    )
  })

  it('throws if "theme.color.light" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        theme: {
          ...mockCampaignInput.theme,
          color: {
            main: '#ff7314',
            light: undefined,
          },
        },
      })
    }).toThrow(
      'Campaign config validation error: "theme.color.light" is required'
    )
  })
})

describe('validation: endTriggers and onEnd', () => {
  it('does not throw if both "endTriggers" and "onEnd" are not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        endTriggers: undefined,
        onEnd: undefined,
      })
    }).not.toThrow()
  })

  it('throws if "endTriggers" is defined but "onEnd" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        endTriggers: {
          ...mockCampaignInput.endTriggers,
          whenGoalAchieved: false,
          whenTimeEnds: true,
        },
        onEnd: undefined,
      })
    }).toThrow(
      'Campaign config validation error: "value" contains [endTriggers] without its required peers [onEnd]'
    )
  })

  it('throws if "onEnd" is defined but "endTriggers" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        endTriggers: undefined,
        onEnd: {
          ...mockCampaignInput.onEnd,
          content: {
            titleMarkdown: '## Some title',
            descriptionMarkdown: '#### A description goes here.',
          },
        },
      })
    }).toThrow(
      'Campaign config validation error: "value" contains [onEnd] without its required peers [endTriggers]'
    )
  })
})

describe('[onEnd] validation: general', () => {
  it('does not throw if "onEnd" is an empty object', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        endTriggers: {
          ...mockCampaignInput.endTriggers,
          whenGoalAchieved: false,
          whenTimeEnds: true,
        },
        onEnd: {},
      })
    }).not.toThrow()
  })

  it('throws if "onEnd" includes "campaignId', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          campaignId: 'my-different-campaign-id',
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.campaignId" is not allowed'
    )
  })

  it('throws if "onEnd" includes "charityId', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          charityId: '5ae19457-a8a7-4c28-89ee-52179a2fb966',
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.charityId" is not allowed'
    )
  })

  it('throws if "onEnd" includes "countNewUsers', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          countNewUsers: false,
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.countNewUsers" is not allowed'
    )
  })

  it('throws if "onEnd" includes "countMoneyRaised', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          countMoneyRaised: false,
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.countMoneyRaised" is not allowed'
    )
  })

  it('throws if "onEnd" includes "countTabsOpened', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          countTabsOpened: false,
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.countTabsOpened" is not allowed'
    )
  })

  it('throws if "onEnd" includes "endTriggers', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          endTriggers: {},
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.endTriggers" is not allowed'
    )
  })

  it('throws if "onEnd" includes "onEnd', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          onEnd: {},
        },
      })
    }).toThrow('Campaign config validation error: "onEnd.onEnd" is not allowed')
  })

  it('throws if "onEnd" includes "time', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          time: {},
        },
      })
    }).toThrow('Campaign config validation error: "onEnd.time" is not allowed')
  })
})

describe('[onEnd] validation: showHeartsDonationButton', () => {
  it('does not throw if "onEnd.showHeartsDonationButton" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          showHeartsDonationButton: undefined,
        },
      })
    }).not.toThrow()
  })

  it('throws if "onEnd.showHeartsDonationButton" is set to a non-boolean value', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          showHeartsDonationButton: 0,
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.showHeartsDonationButton" must be a boolean'
    )
  })

  it('throws if "onEnd.showHeartsDonationButton" is true (changed on campaign end) and "charityId" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        charityId: undefined,
        showHeartsDonationButton: false, // charityId is not required before campaign end
        onEnd: {
          ...mockCampaignInput.onEnd,
          showHeartsDonationButton: true, // now, charityId is required
        },
      })
    }).toThrow('Campaign config validation error: "charityId" is required')
  })
})

describe('[onEnd] validation: content', () => {
  it('does not throws if "onEnd.content" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        endTriggers: {
          ...mockCampaignInput.endTriggers,
          whenGoalAchieved: false,
          whenTimeEnds: true,
        },
        onEnd: {
          ...mockCampaignInput.onEnd,
          content: undefined,
        },
      })
    }).not.toThrow()
  })

  it('throws if "onEnd.content.titleMarkdown" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        endTriggers: {
          ...mockCampaignInput.endTriggers,
          whenGoalAchieved: false,
          whenTimeEnds: true,
        },
        onEnd: {
          ...mockCampaignInput.onEnd,
          content: {
            ...mockCampaignInput.onEnd.content,
            titleMarkdown: undefined,
          },
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.content.titleMarkdown" is required'
    )
  })

  it('throws if "onEnd.content.descriptionMarkdown" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        endTriggers: {
          ...mockCampaignInput.endTriggers,
          whenGoalAchieved: false,
          whenTimeEnds: true,
        },
        onEnd: {
          ...mockCampaignInput.onEnd,
          content: {
            ...mockCampaignInput.onEnd.content,
            descriptionMarkdown: undefined,
          },
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.content.descriptionMarkdown" is required'
    )
  })
})

describe('[onEnd] validation: showProgressBar and goal', () => {
  it('does not throw if "onEnd.goal" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          goal: undefined,
          showProgressBar: false, // required if a goal is not defined
        },
      })
    }).not.toThrow()
  })

  it('does not throw if "onEnd.goal.impactUnitSingular" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          goal: {
            impactUnitSingular: undefined,
          },
        },
      })
    }).not.toThrow()
  })

  it('does not throws if "onEnd.goal.impactUnitPlural" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          goal: {
            impactUnitPlural: undefined,
          },
        },
      })
    }).not.toThrow()
  })

  it('does not throw if "onEnd.goal.impactVerbPastTense" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          goal: {
            impactVerbPastTense: undefined,
          },
        },
      })
    }).not.toThrow()
  })

  it('does not throw if "onEnd.goal.limitProgressToTargetMax" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          goal: {
            limitProgressToTargetMax: undefined,
          },
        },
      })
    }).not.toThrow()
  })

  it('throws if "onEnd.goal.targetNumber" is set (it is not allowed)', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          goal: {
            targetNumber: '100 thousand',
          },
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.goal.targetNumber" is not allowed'
    )
  })

  it('throws if "onEnd.goal.numberSource" is set (it is not allowed)', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          goal: {
            numberSource: 'hearts',
          },
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.goal.numberSource" is not allowed'
    )
  })

  it('throws if "onEnd.goal.transformNumberSourceValue" is set (it is not allowed)', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          goal: {
            transformNumberSourceValue: num => num * 3,
          },
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.goal.transformNumberSourceValue" is not allowed'
    )
  })

  it('does not throw if "onEnd.showProgressBar" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          showProgressBar: undefined,
        },
      })
    }).not.toThrow()
  })

  it('throws if "onEnd.showProgressBar" is set to a non-boolean value', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          showProgressBar: 0,
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.showProgressBar" must be a boolean'
    )
  })

  it('does not throw if "goal" is defined but "onEnd.goal" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: {
          ...mockCampaignInput.goal,
          impactUnitSingular: 'Heart',
          impactUnitPlural: 'Hearts',
          impactVerbPastTense: 'raised',
          limitProgressToTargetMax: false,
          numberSource: 'hearts',
          showProgressBarLabel: true,
          showProgressBarEndText: false,
          targetNumber: 10e6,
          transformNumberSourceValue: undefined, // optional function
        },
        onEnd: {
          ...mockCampaignInput.onEnd,
          goal: undefined,
          showProgressBar: true,
        },
        showProgressBar: false,
      })
    }).not.toThrow()
  })

  it('throws if "goal" is not defined but "onEnd.goal" is defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: undefined,
        onEnd: {
          ...mockCampaignInput.onEnd,
          goal: {
            ...(mockCampaignInput.onEnd.goal || {}),
            impactUnitSingular: 'Heart',
            impactUnitPlural: 'Hearts',
            impactVerbPastTense: 'raised',
            limitProgressToTargetMax: false,
            numberSource: 'hearts',
            showProgressBarLabel: true,
            showProgressBarEndText: false,
            targetNumber: 10e6,
            transformNumberSourceValue: undefined, // optional function
          },
          showProgressBar: true,
        },
        showProgressBar: false,
      })
    }).toThrow('Campaign config validation error: "onEnd.goal" is not allowed')
  })

  it('throws if "onEnd.showProgressBar" is set to true but "goal" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        goal: undefined,
        onEnd: {
          ...mockCampaignInput.onEnd,
          goal: undefined,
          showProgressBar: true,
        },
        showProgressBar: false,
      })
    }).toThrow('Campaign config validation error: "goal" is required')
  })
})

describe('[onEnd] validation: showCountdownTimer', () => {
  it('does not throw if "onEnd.showCountdownTimer" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          showCountdownTimer: undefined,
        },
      })
    }).not.toThrow()
  })

  it('throws if "onEnd.showCountdownTimer" is set to a non-boolean value', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          showCountdownTimer: 0,
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.showCountdownTimer" must be a boolean'
    )
  })
})

describe('[onEnd] validation: theme', () => {
  it('does not throw if "onEnd.theme" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          theme: undefined,
        },
      })
    }).not.toThrow()
  })

  it('does not throw if "onEnd.theme" is an empty object', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          theme: {},
        },
      })
    }).not.toThrow()
  })

  it('throws if "onEnd.theme.color.main" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          theme: {
            ...mockCampaignInput.onEnd.theme,
            color: {
              main: undefined,
              light: '#f6924e',
            },
          },
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.theme.color.main" is required'
    )
  })

  it('throws if "onEnd.theme.color.light" is not defined', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    expect(() => {
      return createCampaignConfiguration({
        ...mockCampaignInput,
        onEnd: {
          ...mockCampaignInput.onEnd,
          theme: {
            ...mockCampaignInput.onEnd.theme,
            color: {
              main: '#ff7314',
              light: undefined,
            },
          },
        },
      })
    }).toThrow(
      'Campaign config validation error: "onEnd.theme.color.light" is required'
    )
  })
})

describe('addMoneyRaised', () => {
  it('calls Redis as expected when calling addMoneyRaised and countMoneyRaised is true', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countMoneyRaised: true,
    })
    const moneyToAdd = 0.0231
    await campaignConfig.addMoneyRaised(moneyToAdd)
    expect(callRedis).toHaveBeenCalledWith({
      operation: 'INCRBY',
      key: 'campaign:myFunCampaign:moneyRaised',
      amountToAdd: 23100000,
    })
  })

  it('does not call Redis when calling addMoneyRaised if countMoneyRaised is false', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countMoneyRaised: false,
    })
    const moneyToAdd = 0.0231
    await campaignConfig.addMoneyRaised(moneyToAdd)
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('does not call Redis when calling addMoneyRaised if countMoneyRaised is undefined (it defaults to false)', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countMoneyRaised: undefined,
    })
    const moneyToAdd = 0.0231
    await campaignConfig.addMoneyRaised(moneyToAdd)
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('does not call Redis when calling addMoneyRaised if the campaign is no longer live', async () => {
    expect.assertions(1)
    process.env.IS_GLOBAL_CAMPAIGN_LIVE = false // campaign is not live
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countMoneyRaised: true,
    })
    const moneyToAdd = 0.0231
    await campaignConfig.addMoneyRaised(moneyToAdd)
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('still calls Redis when calling addMoneyRaised if we passed the campaign end time', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countMoneyRaised: true,
      time: {
        ...mockCampaignInput.time,
        start: '2020-04-21T18:00:00.000Z',
        end: '2020-04-28T18:00:00.000Z', // campaign has ended
      },
    })
    const moneyToAdd = 0.0231
    await campaignConfig.addMoneyRaised(moneyToAdd)
    expect(callRedis).toHaveBeenCalledWith({
      operation: 'INCRBY',
      key: 'campaign:myFunCampaign:moneyRaised',
      amountToAdd: 23100000,
    })
  })

  it('calls Redis with a rounded money raised value if addMoneyRaised is called with a float beyond nano precision', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countMoneyRaised: true,
    })
    const moneyToAdd = 0.0231798231798231798 // super long
    await campaignConfig.addMoneyRaised(moneyToAdd)
    expect(callRedis.mock.calls[0][0].amountToAdd).toEqual(23179823)
  })
})

describe('incrementNewUserCount', () => {
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

  it('does not call Redis when calling incrementNewUserCount and countNewUsers is undefined (it defaults to false)', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countNewUsers: undefined,
    })
    await campaignConfig.incrementNewUserCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('does not call Redis when calling incrementNewUserCount if the campaign is no longer live', async () => {
    expect.assertions(1)
    process.env.IS_GLOBAL_CAMPAIGN_LIVE = false // campaign is not live
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countNewUsers: true,
    })
    await campaignConfig.incrementNewUserCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('still calls Redis when calling incrementNewUserCount and the campaign if we passed the campaign end time', async () => {
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
    expect(callRedis).toHaveBeenCalledWith({
      operation: 'INCR',
      key: 'campaign:myFunCampaign:newUsers',
    })
  })
})

describe('incrementTabCount', () => {
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

  it('does not call Redis when calling incrementTabCount and countTabsOpened is undefined (it defaults to false)', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countTabsOpened: undefined,
    })
    await campaignConfig.incrementTabCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('does not call Redis when calling incrementTabCount if the campaign is no longer live', async () => {
    expect.assertions(1)
    process.env.IS_GLOBAL_CAMPAIGN_LIVE = false // campaign is not live
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myFunCampaign',
      countTabsOpened: true,
    })
    await campaignConfig.incrementTabCount()
    expect(callRedis).not.toHaveBeenCalled()
  })

  it('still calls Redis when calling incrementTabCount and the campaign if we passed the campaign end time', async () => {
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
    expect(callRedis).toHaveBeenCalledWith({
      operation: 'INCR',
      key: 'campaign:myFunCampaign:tabsOpened',
    })
  })
})

describe('charity data (getCharityData)', () => {
  it('fetches the charity as expected when calling getCharityData', async () => {
    expect.assertions(1)
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      charityId: 'fdb15917-ded3-4ea0-9eb9-82300cb464a0',
    })
    const mockUserContext = getMockUserContext()
    await campaignConfig.getCharityData(mockUserContext)
    expect(CharityModel.get).toHaveBeenCalledWith(
      mockUserContext,
      'fdb15917-ded3-4ea0-9eb9-82300cb464a0'
    )
  })

  it('returns the expected charity data when calling getCharityData', async () => {
    expect.assertions(1)
    CharityModel.get.mockReturnValue({
      id: 'fdb15917-ded3-4ea0-9eb9-82300cb464a0',
      foo: 'bar',
    })
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      charityId: 'fdb15917-ded3-4ea0-9eb9-82300cb464a0',
    })
    const mockUserContext = getMockUserContext()
    const charityData = await campaignConfig.getCharityData(mockUserContext)
    expect(charityData).toEqual({
      id: 'fdb15917-ded3-4ea0-9eb9-82300cb464a0',
      foo: 'bar',
    })
  })

  it('returns null charity data when no charityId is defined in the config', async () => {
    expect.assertions(1)
    CharityModel.get.mockReturnValue({
      id: 'fdb15917-ded3-4ea0-9eb9-82300cb464a0',
      foo: 'bar',
    })
    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      goal: undefined, // cannot have a goal that relies on hearts when charityId is null
      showHeartsDonationButton: false, // required when charityId is null
      showProgressBar: false, // this must be false because we set "goal" to null
      charityId: undefined, // no charity ID defined
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
      charityId: 'fdb15917-ded3-4ea0-9eb9-82300cb464a0',
    })
    const mockUserContext = getMockUserContext()
    await expect(
      campaignConfig.getCharityData(mockUserContext)
    ).rejects.toEqual(mockErr)
  })
})

describe('goal data (goal.getCurrentNumber)', () => {
  it('returns the expected value from "goal.getCurrentNumber" when "goal.numberSource" === "hearts"', async () => {
    expect.assertions(1)

    // Mock response for fetching VC donated to the charity.
    getCharityVcReceived.mockResolvedValue(11235)

    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      goal: {
        ...mockCampaignInput.goal,
        numberSource: 'hearts',
      },
    })
    const mockUserContext = getMockUserContext()
    const currentNum = await campaignConfig.goal.getCurrentNumber(
      mockUserContext
    )
    expect(currentNum).toEqual(11235)
  })

  it('calls getCharityVcReceived with the expected arguments when "goal.numberSource" === "hearts"', async () => {
    expect.assertions(1)

    // Mock response for fetching VC donated to the charity.
    getCharityVcReceived.mockResolvedValue(11235)

    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      charityId: 'fdb15917-ded3-4ea0-9eb9-82300cb464a0',
      goal: {
        ...mockCampaignInput.goal,
        numberSource: 'hearts',
      },
      time: {
        start: '2021-01-01T18:00:00.000Z',
        end: '2021-01-05T18:00:00.000Z',
      },
    })
    const mockUserContext = getMockUserContext()
    await campaignConfig.goal.getCurrentNumber(mockUserContext)
    expect(getCharityVcReceived).toHaveBeenCalledWith(
      mockUserContext,
      'fdb15917-ded3-4ea0-9eb9-82300cb464a0',
      '2021-01-01T18:00:00.000Z',
      '2021-01-05T18:00:00.000Z'
    )
  })

  it('throws if getCharityVcReceived throws when calling "goal.getCurrentNumber" and "goal.numberSource" === "hearts"', async () => {
    expect.assertions(1)

    // Mock response for fetching VC donated to the charity.
    const mockErr = new Error('Hearts? What Hearts?')
    getCharityVcReceived.mockRejectedValue(mockErr)

    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      goal: {
        ...mockCampaignInput.goal,
        numberSource: 'hearts',
      },
    })
    const mockUserContext = getMockUserContext()
    await expect(
      campaignConfig.goal.getCurrentNumber(mockUserContext)
    ).rejects.toEqual(mockErr)
  })

  it('returns the expected value from "goal.getCurrentNumber" when "goal.numberSource" === "moneyRaised"', async () => {
    expect.assertions(1)

    // Mock a response from Redis.
    callRedis.mockResolvedValue(23147000) // nano $USD

    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      countMoneyRaised: true,
      goal: {
        ...mockCampaignInput.goal,
        numberSource: 'moneyRaised',
      },
    })
    const mockUserContext = getMockUserContext()
    const currentNum = await campaignConfig.goal.getCurrentNumber(
      mockUserContext
    )
    expect(currentNum).toEqual(0.023147)
  })

  it('calls Redis as expected when calling "goal.getCurrentNumber" when "goal.numberSource" === "moneyRaised"', async () => {
    expect.assertions(1)

    // Mock a response from Redis.
    callRedis.mockResolvedValue(23147000) // nano $USD

    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myWonderfulCampaign',
      countMoneyRaised: true,
      goal: {
        ...mockCampaignInput.goal,
        numberSource: 'moneyRaised',
      },
    })
    const mockUserContext = getMockUserContext()
    await campaignConfig.goal.getCurrentNumber(mockUserContext)
    expect(callRedis).toHaveBeenCalledWith({
      operation: 'GET',
      key: 'campaign:myWonderfulCampaign:moneyRaised',
    })
  })

  it('returns the expected value from "goal.getCurrentNumber" when "goal.numberSource" === "newUsers"', async () => {
    expect.assertions(1)

    // Mock a response from Redis.
    callRedis.mockResolvedValue(321)

    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      countNewUsers: true,
      goal: {
        ...mockCampaignInput.goal,
        numberSource: 'newUsers',
      },
    })
    const mockUserContext = getMockUserContext()
    const currentNum = await campaignConfig.goal.getCurrentNumber(
      mockUserContext
    )
    expect(currentNum).toEqual(321)
  })

  it('calls Redis as expected when calling "goal.getCurrentNumber" when "goal.numberSource" === "newUsers"', async () => {
    expect.assertions(1)

    // Mock a response from Redis.
    callRedis.mockResolvedValue(321)

    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myWonderfulCampaign',
      countNewUsers: true,
      goal: {
        ...mockCampaignInput.goal,
        numberSource: 'newUsers',
      },
    })
    const mockUserContext = getMockUserContext()
    await campaignConfig.goal.getCurrentNumber(mockUserContext)
    expect(callRedis).toHaveBeenCalledWith({
      operation: 'GET',
      key: 'campaign:myWonderfulCampaign:newUsers',
    })
  })

  it('returns the expected value from "goal.getCurrentNumber" when "goal.numberSource" === "tabsOpened"', async () => {
    expect.assertions(1)

    // Mock a response from Redis.
    callRedis.mockResolvedValue(321)

    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      countTabsOpened: true,
      goal: {
        ...mockCampaignInput.goal,
        numberSource: 'tabsOpened',
      },
    })
    const mockUserContext = getMockUserContext()
    const currentNum = await campaignConfig.goal.getCurrentNumber(
      mockUserContext
    )
    expect(currentNum).toEqual(321)
  })

  it('calls Redis as expected when calling "goal.getCurrentNumber" when "goal.numberSource" === "tabsOpened"', async () => {
    expect.assertions(1)

    // Mock a response from Redis.
    callRedis.mockResolvedValue(321)

    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      campaignId: 'myWonderfulCampaign',
      countTabsOpened: true,
      goal: {
        ...mockCampaignInput.goal,
        numberSource: 'tabsOpened',
      },
    })
    const mockUserContext = getMockUserContext()
    await campaignConfig.goal.getCurrentNumber(mockUserContext)
    expect(callRedis).toHaveBeenCalledWith({
      operation: 'GET',
      key: 'campaign:myWonderfulCampaign:tabsOpened',
    })
  })

  it('returns the expected value from "goal.getCurrentNumber", using the "transformNumberSourceValue" function to modify it [test #1]', async () => {
    expect.assertions(1)

    // Mock response for fetching VC donated to the charity.
    getCharityVcReceived.mockResolvedValue(11235)

    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      goal: {
        ...mockCampaignInput.goal,
        numberSource: 'hearts',
        transformNumberSourceValue: num => num * 2,
      },
    })
    const mockUserContext = getMockUserContext()
    const currentNum = await campaignConfig.goal.getCurrentNumber(
      mockUserContext
    )

    // Without the transformNumberSourceValue function, we would
    // expect this to return 11235.
    expect(currentNum).toEqual(22470)
  })

  it('returns the expected value from "goal.getCurrentNumber", using the "transformNumberSourceValue" function to modify it [test #2]', async () => {
    expect.assertions(1)

    // Mock a response from Redis.
    callRedis.mockResolvedValue(8314224839892) // nano $USD

    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      countMoneyRaised: true,
      goal: {
        ...mockCampaignInput.goal,
        numberSource: 'moneyRaised',
        transformNumberSourceValue: num => Math.round(num),
      },
    })
    const mockUserContext = getMockUserContext()
    const currentNum = await campaignConfig.goal.getCurrentNumber(
      mockUserContext
    )

    // Without the transformNumberSourceValue function, we would
    // expect this to return 8314.224839892.
    expect(currentNum).toEqual(8314)
  })

  it('returns the expected value from "goal.getCurrentNumber", using the "transformNumberSourceValue" function to modify it [test #3]', async () => {
    expect.assertions(1)

    // Mock a response from Redis.
    callRedis.mockResolvedValue(8314224839892) // nano $USD

    const mockCampaignInput = getMockCampaignConfigInput()
    const campaignConfig = createCampaignConfiguration({
      ...mockCampaignInput,
      countMoneyRaised: true,
      goal: {
        ...mockCampaignInput.goal,
        numberSource: 'moneyRaised',
        transformNumberSourceValue: () => 24681357, // just entirely ignore the source value
      },
    })
    const mockUserContext = getMockUserContext()
    const currentNum = await campaignConfig.goal.getCurrentNumber(
      mockUserContext
    )

    expect(currentNum).toEqual(24681357)
  })
})
