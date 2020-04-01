/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import { shallow } from 'enzyme'
import Markdown from 'js/components/General/Markdown'
import IconButton from '@material-ui/core/IconButton'
import DonateHeartsControls from 'js/components/Donate/DonateHeartsControlsContainer'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'

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

const campaignEndTitle = '## The End Title'

const campaignEndDescription = `
#### Some end description.
`

const getMockProps = () => ({
  app: {
    campaign: {
      campaignId: 'mock-id',
      charity: {
        id: 'Q2hhcml0eTo2NjY3ZWI4Ni1lYTM3LTRkM2QtOTI1OS05MTBiZWEwYjVlMzg=',
        image:
          'https://prod-tab2017-media.gladly.io/img/charities/charity-post-donation-images/covid-19-solidarity.jpg',
        imageCaption: null,
        impact:
          'With your help, the World Health Organization will continue to provide COVID-19 relief, prevention, and detection.',
        name: 'COVID-19 Solidarity Response Fund',
        vcReceived: 16474011,
        website:
          'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/donate',
      },
      content: {
        titleMarkdown: campaignTitle,
        descriptionMarkdown: campaignDescription,
      },
      endContent: {
        titleMarkdown: campaignEndTitle,
        descriptionMarkdown: campaignEndDescription,
      },
      goal: {
        targetNumber: 10e6,
        currentNumber: 16.6e6,
        impactUnitSingular: 'Heart',
        impactUnitPlural: 'Hearts',
        impactVerbPastTense: 'donated',
      },
      isLive: true,
      numNewUsers: undefined, // probably want to roll into generic goal
      showCountdownTimer: false,
      showHeartsDonationButton: true,
      showProgressBar: true,
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

  it('displays the content.descriptionMarkdown when the campaign is active', () => {
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

  it('displays the endContent.titleMarkdown when the campaign has ended', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          endContent: {
            ...defaultMockProps.app.campaign.endContent,
            titleMarkdown: '## Hey, I am the ending title :)',
          },
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-03-28T18:00:00.000Z', // has ended
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
    ).toEqual('## Hey, I am the ending title :)')
  })

  it('displays the endContent.descriptionMarkdown when the campaign has ended', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        campaign: {
          ...defaultMockProps.app.campaign,
          endContent: {
            ...defaultMockProps.app.campaign.endContent,
            descriptionMarkdown:
              '#### Hey, I am a nice description for the end of the campaign :)',
          },
          time: {
            ...defaultMockProps.app.campaign.time,
            start: '2020-03-25T18:00:00.000Z',
            end: '2020-03-28T18:00:00.000Z', // has ended
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
    ).toEqual(
      '#### Hey, I am a nice description for the end of the campaign :)'
    )
  })

  it('displays the DonateHeartsControls when showHeartsDonationButton is true and the campaign is active', () => {
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

  it('does not display the DonateHeartsControls when showHeartsDonationButton is false and the campaign is active', () => {
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

  it('does not display the DonateHeartsControls when showHeartsDonationButton is true but the campaign has ended', () => {
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
            end: '2020-03-28T18:00:00.000Z', // has ended
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

  // TODO: more tests
})
