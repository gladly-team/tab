/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import { shallow } from 'enzyme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import Markdown from 'js/components/General/Markdown'
import CountdownClock from 'js/components/Campaign/CountdownClockComponent'
import DonateHeartsControls from 'js/components/Donate/DonateHeartsControlsContainer'
import SocialShare from 'js/components/General/SocialShareComponent'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'

jest.mock('js/components/Campaign/CountdownClockComponent')
jest.mock('js/components/Donate/DonateHeartsControlsContainer')
jest.mock('js/components/General/Markdown')
jest.mock('js/utils/local-user-data-mgr')

const mockNow = '2020-04-02T18:00:00.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  MockDate.reset()
})

const campaignTitle = '## Some Title'

const campaignDescription = `
#### Some description here.

#### And more description here.
`

const getMockProps = () => ({
  app: {
    campaign: {
      campaignId: 'mock-id',
      charity: {
        id: 'some-charity-id',
        image: 'https://example.com/img.png',
        imageCaption: null,
        impact: 'With your help, this charity will keep doing good things.',
        name: 'The Charity Name',
        vcReceived: 16474011,
        website: 'https://example.com',
      },
      content: {
        titleMarkdown: campaignTitle,
        descriptionMarkdown: campaignDescription,
        descriptionMarkdownTwo: undefined, // optional additional markdown
      },
      goal: {
        targetNumber: 5000,
        currentNumber: 2468,
        impactUnitSingular: 'meal',
        impactUnitPlural: 'meals',
        impactVerbPastParticiple: 'given',
        impactVerbPastTense: 'gave',
        limitProgressToTargetMax: false,
        showProgressBarLabel: true,
        showProgressBarEndText: false,
      },
      isLive: true,
      numNewUsers: undefined, // probably want to roll into generic goal
      showCountdownTimer: false,
      showHeartsDonationButton: true,
      showProgressBar: true,
      showSocialSharing: true,
      socialSharing: {
        url: 'https://tab.gladly.io/covid-19/',
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
        start: '2020-03-25T18:00:00.000Z',
        end: '2020-05-01T18:00:00.000Z',
      },
    },
  },
  user: {
    vcCurrent: 212,
  },
  showError: () => {},
  onDismiss: () => {},
})

// Dive past wrappers we don't want to test.
const shallowRenderCampaign = component =>
  shallow(component)
    .dive()
    .dive()
    .dive()

describe('CampaignGenericComponent', () => {
  it('renders without error', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const mockProps = getMockProps()
    shallowRenderCampaign(<CampaignGenericComponent {...mockProps} />)
  })

  it('sets the dismiss time in local storage when clicking the "dismiss" button', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    wrapper
      .find(IconButton)
      .first()
      .simulate('click')
    expect(setCampaignDismissTime).toHaveBeenCalled()
  })

  it('calls the onDismiss prop when clicking the "dismiss" button', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const mockProps = {
      ...getMockProps(),
      onDismiss: jest.fn(),
    }
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    wrapper
      .find(IconButton)
      .first()
      .simulate('click')
    expect(mockProps.onDismiss).toHaveBeenCalled()
  })

  it('displays the content.titleMarkdown when the campaign is active', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          content: {
            ...defaultMockProps.app.campaign.content,
            titleMarkdown: '## Hey, I am a title!',
          },
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(
      wrapper
        .find(Markdown)
        .first()
        .prop('children')
    ).toEqual('## Hey, I am a title!')
  })

  it('displays the content.descriptionMarkdown', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          content: {
            ...defaultMockProps.app.campaign.content,
            descriptionMarkdown: '#### Hey, I am a nice description.',
          },
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(
      wrapper
        .find(Markdown)
        .at(1)
        .prop('children')
    ).toEqual('#### Hey, I am a nice description.')
  })

  it('displays the content.descriptionMarkdownTwo when provided', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          content: {
            ...defaultMockProps.app.campaign.content,
            descriptionMarkdownTwo: '#### I am another nice description.',
          },
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(
      wrapper
        .find(Markdown)
        .at(2) // after the descriptionMarkdown
        .prop('children')
    ).toEqual('#### I am another nice description.')
  })

  it('does not display the content.descriptionMarkdownTwo when not provided', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          content: {
            ...defaultMockProps.app.campaign.content,
            descriptionMarkdownTwo: '#### I am another nice description.',
          },
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )

    // GEt the number of Markdown elements.
    const numMarkdowns = wrapper.find(Markdown).length

    // Remove descriptionMarkdownTwo.
    wrapper.setProps({
      ...mockProps,
      app: {
        ...mockProps.app,
        campaign: {
          ...mockProps.app.campaign,
          content: {
            ...mockProps.app.campaign.content,
            descriptionMarkdownTwo: undefined,
          },
        },
      },
    })

    // There should be one fewer Markdown elements.
    expect(wrapper.find(Markdown).length).toEqual(numMarkdowns - 1)
  })

  it('displays the DonateHeartsControls when showHeartsDonationButton is true', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          charity: {
            ...defaultMockProps.app.campaign.charity,
            id: 'some-charity-id',
          },
          showHeartsDonationButton: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(DonateHeartsControls).exists()).toBe(true)
  })

  it('passes the expected props to DonateHeartsControls', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          charity: {
            ...defaultMockProps.app.campaign.charity,
            id: 'some-charity-id',
          },
          showHeartsDonationButton: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(DonateHeartsControls).props()).toEqual({
      user: mockProps.user,
      charity: mockProps.app.campaign.charity,
      showError: expect.any(Function),
    })
  })

  it('does not display the DonateHeartsControls when showHeartsDonationButton is false', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          charity: {
            ...defaultMockProps.app.campaign.charity,
            id: 'some-charity-id',
          },
          showHeartsDonationButton: false, // don't show
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(DonateHeartsControls).exists()).toBe(false)
  })

  it('still displays the DonateHeartsControls when showHeartsDonationButton is true, even when we are past the "time.end" time', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          charity: {
            ...defaultMockProps.app.campaign.charity,
            id: 'some-charity-id',
          },
          showHeartsDonationButton: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-03-28T18:00:00.000Z', // we passed this
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(DonateHeartsControls).exists()).toBe(true)
  })

  it('displays the SocialShare component when "showSocialSharing" is true', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          showSocialSharing: true,
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(SocialShare).exists()).toBe(true)
  })

  it('passes the expected props to the SocialShare component', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          showSocialSharing: true,
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(SocialShare).props()).toEqual({
      url: 'https://tab.gladly.io/covid-19/',
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
    })
  })

  it('does not display the SocialShare component when "showSocialSharing" is false', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          showSocialSharing: false,
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(SocialShare).exists()).toBe(false)
  })

  it('displays the progress bar when showProgressBar is true', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 3214,
            impactUnitSingular: 'puppy',
            impactUnitPlural: 'puppies',
            impactVerbPastParticiple: 'adopted',
            impactVerbPastTense: 'adopted',
            limitProgressToTargetMax: true,
            showProgressBarLabel: true,
            showProgressBarEndText: false,
          },
          showProgressBar: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(LinearProgress).exists()).toBe(true)
  })

  it('displays the progress bar when showProgressBar is true, even if we are past the  campaign "time.end" time', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 3214,
            impactUnitSingular: 'puppy',
            impactUnitPlural: 'puppies',
            impactVerbPastParticiple: 'adopted',
            impactVerbPastTense: 'adopted',
          },
          showProgressBar: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-03-28T18:00:00.000Z', // we passed this
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(LinearProgress).exists()).toBe(true)
  })

  it('displays the correct amount of progress in the progress bar', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 3214,
            impactUnitSingular: 'puppy',
            impactUnitPlural: 'puppies',
            impactVerbPastParticiple: 'adopted',
            impactVerbPastTense: 'adopted',
            limitProgressToTargetMax: true,
            showProgressBarLabel: true,
            showProgressBarEndText: false,
          },
          showProgressBar: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(LinearProgress).prop('value')).toBeCloseTo(26.7833)
  })

  it('passes a progress bar value of >100% when limitProgressToTargetMax is false', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 18021,
            impactUnitSingular: 'puppy',
            impactUnitPlural: 'puppies',
            impactVerbPastParticiple: 'adopted',
            impactVerbPastTense: 'adopted',
            limitProgressToTargetMax: false,
            showProgressBarLabel: true,
            showProgressBarEndText: false,
          },
          showProgressBar: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(LinearProgress).prop('value')).toBeGreaterThan(100)
  })

  it('passes a progress bar value of exactly 100% when limitProgressToTargetMax is true', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 18021,
            impactUnitSingular: 'puppy',
            impactUnitPlural: 'puppies',
            impactVerbPastParticiple: 'adopted',
            impactVerbPastTense: 'adopted',
            limitProgressToTargetMax: true,
            showProgressBarLabel: true,
            showProgressBarEndText: false,
          },
          showProgressBar: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(LinearProgress).prop('value')).toEqual(100.0)
  })

  it('displays the current goal number text when showProgressBar is true', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 3214,
            impactUnitSingular: 'hug',
            impactUnitPlural: 'hugs',
            impactVerbPastParticiple: 'given',
            impactVerbPastTense: 'gave',
            limitProgressToTargetMax: true,
            showProgressBarLabel: true,
            showProgressBarEndText: false,
          },
          showProgressBar: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return n.render().text() === '3.2K hugs given'
        })
        .exists()
    ).toBe(true)
  })

  it('does not display the current goal number text when showProgressBar is false', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 3214,
            impactUnitSingular: 'hug',
            impactUnitPlural: 'hugs',
            impactVerbPastParticiple: 'given',
            impactVerbPastTense: 'gave',
            limitProgressToTargetMax: true,
            showProgressBarLabel: true,
            showProgressBarEndText: false,
          },
          showProgressBar: false, // not showing
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return n.render().text() === '3.2K hugs given'
        })
        .exists()
    ).toBe(false)
  })

  it('still displays the current goal number text when showProgressBar is true, even when we are past the "time.end" time', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 3214,
            impactUnitSingular: 'hug',
            impactUnitPlural: 'hugs',
            impactVerbPastParticiple: 'given',
            impactVerbPastTense: 'gave',
            limitProgressToTargetMax: true,
            showProgressBarLabel: true,
            showProgressBarEndText: false,
          },
          showProgressBar: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-03-28T18:00:00.000Z', // we passed this
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return n.render().text() === '3.2K hugs given'
        })
        .exists()
    ).toBe(true)
  })

  it('displays the goal target text when showProgressBar is true', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 3214,
            impactUnitSingular: 'hug',
            impactUnitPlural: 'hugs',
            impactVerbPastParticiple: 'given',
            impactVerbPastTense: 'gave',
            limitProgressToTargetMax: true,
            showProgressBarLabel: true,
            showProgressBarEndText: false,
          },
          showProgressBar: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return n.render().text() === 'Goal: 12K'
        })
        .exists()
    ).toBe(true)
  })

  it('displays the full current goal number text (exceeding target number) when limitProgressToTargetMax is false', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 18000,
            impactUnitSingular: 'hug',
            impactUnitPlural: 'hugs',
            impactVerbPastParticiple: 'given',
            impactVerbPastTense: 'gave',
            limitProgressToTargetMax: false,
            showProgressBarLabel: true,
            showProgressBarEndText: false,
          },
          showProgressBar: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return n.render().text() === '18K hugs given'
        })
        .exists()
    ).toBe(true)
  })

  it('displays the maximum goal number text (current number exceeds the target number) when limitProgressToTargetMax is true', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 18000,
            impactUnitSingular: 'hug',
            impactUnitPlural: 'hugs',
            impactVerbPastParticiple: 'given',
            impactVerbPastTense: 'gave',
            limitProgressToTargetMax: true,
            showProgressBarLabel: true,
            showProgressBarEndText: false,
          },
          showProgressBar: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return n.render().text() === '12K hugs given'
        })
        .exists()
    ).toBe(true)
  })

  it('does not display the goal target text when showProgressBar is false', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 3214,
            impactUnitSingular: 'hug',
            impactUnitPlural: 'hugs',
            impactVerbPastParticiple: 'given',
            impactVerbPastTense: 'gave',
            limitProgressToTargetMax: true,
            showProgressBarLabel: true,
            showProgressBarEndText: false,
          },
          showProgressBar: false, // not showing
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return n.render().text() === 'Goal: 12K'
        })
        .exists()
    ).toBe(false)
  })

  it('still displays the goal target text when showProgressBar is true, even when we are past the "time.end" time', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 3214,
            impactUnitSingular: 'hug',
            impactUnitPlural: 'hugs',
            impactVerbPastParticiple: 'given',
            impactVerbPastTense: 'gave',
            limitProgressToTargetMax: true,
            showProgressBarLabel: true,
            showProgressBarEndText: false,
          },
          showProgressBar: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-03-28T18:00:00.000Z', // we passed this
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return n.render().text() === 'Goal: 12K'
        })
        .exists()
    ).toBe(true)
  })

  it('displays the "end campaign" goal text when "showProgressBarEndText" is true', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 3214,
            impactUnitSingular: 'hug',
            impactUnitPlural: 'hugs',
            impactVerbPastParticiple: 'given',
            impactVerbPastTense: 'gave',
            limitProgressToTargetMax: true,
            showProgressBarLabel: false,
            showProgressBarEndText: true,
          },
          showProgressBar: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return (
            n.render().text() ===
            'Great job! Together, we gave 14.8K hugs of our 12K goal.'
          )
        })
        .exists()
    ).toBe(false)
  })

  it('does not display the "end campaign" goal text even when we are past the "time.end" time if "showProgressBarEndText" is false', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          goal: {
            ...defaultMockProps.app.campaign.goal,
            targetNumber: 12000,
            currentNumber: 3214,
            impactUnitSingular: 'hug',
            impactUnitPlural: 'hugs',
            impactVerbPastParticiple: 'given',
            impactVerbPastTense: 'gave',
            limitProgressToTargetMax: true,
            showProgressBarLabel: true,
            showProgressBarEndText: false,
          },
          showProgressBar: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-03-28T18:00:00.000Z', // we passed this
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return (
            n.render().text() ===
            'Great job! Together, we gave 14.8K hugs of our 12K goal.'
          )
        })
        .exists()
    ).toBe(false)
  })

  it('displays the CountdownClock when showCountdownTimer is true', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          showCountdownTimer: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(CountdownClock).exists()).toBe(true)
  })

  it('passes the expected props to the CountdownClock', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          showCountdownTimer: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-05-01T18:00:00.000Z',
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(CountdownClock).props()).toEqual({
      campaignStartDatetime: moment('2020-03-25T18:00:00.000Z'),
      campaignEndDatetime: moment('2020-05-01T18:00:00.000Z'),
    })
  })

  it('still displays the CountdownClock when showCountdownTimer is true, even when we are past the "time.end" time', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          showCountdownTimer: true,
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-03-28T18:00:00.000Z', // we passed this
          },
        },
      },
    }
    mockProps.onDismiss = jest.fn()
    const wrapper = shallowRenderCampaign(
      <CampaignGenericComponent {...mockProps} />
    )
    expect(wrapper.find(CountdownClock).exists()).toBe(true)
  })
})

describe('CampaignGenericComponent: theme wrapper', () => {
  it('renders an MuiThemeProvider', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<CampaignGenericComponent {...mockProps} />)
    expect(wrapper.find(MuiThemeProvider).exists()).toBe(true)
  })

  it('sets the color palette in the theme, if provided', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          theme: {
            ...defaultMockProps.app.campaign.theme,
            color: {
              ...defaultMockProps.app.campaign.theme.color,
              main: '#6fba23',
              light: '#87de2f',
            },
          },
        },
      },
    }
    const wrapper = shallow(<CampaignGenericComponent {...mockProps} />)
    const themeDefinition = wrapper.find(MuiThemeProvider).prop('theme')
    expect(themeDefinition.palette.primary.main).toEqual('#6fba23')
    expect(themeDefinition.palette.primary.light).toEqual('#87de2f')
    expect(themeDefinition.palette.secondary.main).toEqual('#6fba23')
    expect(themeDefinition.palette.secondary.light).toEqual('#87de2f')
  })
})
