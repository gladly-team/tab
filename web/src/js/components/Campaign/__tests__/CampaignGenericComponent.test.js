/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import IconButton from '@material-ui/core/IconButton'
import { setCampaignDismissTime } from 'js/utils/local-user-data-mgr'

jest.mock('js/utils/local-user-data-mgr')

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

describe('CampaignGenericComponent', () => {
  it('renders without error', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const mockProps = getMockProps()
    shallow(<CampaignGenericComponent {...mockProps} />)
      .dive()
      .dive()
      .dive()
  })

  it('sets the dismiss time in local storage when clicking the "dismiss" button ', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<CampaignGenericComponent {...mockProps} />)
      .dive()
      .dive()
      .dive()
    wrapper
      .find(IconButton)
      .first()
      .simulate('click')
    expect(setCampaignDismissTime).toHaveBeenCalled()
  })

  it('calls the onDismiss prop when clicking the "dismiss" button ', () => {
    const CampaignGenericComponent = require('js/components/Campaign/CampaignGenericComponent')
      .default
    const mockProps = getMockProps()
    mockProps.onDismiss = jest.fn()
    const wrapper = shallow(<CampaignGenericComponent {...mockProps} />)
      .dive()
      .dive()
      .dive()
    wrapper
      .find(IconButton)
      .first()
      .simulate('click')
    expect(mockProps.onDismiss).toHaveBeenCalled()
  })

  // TODO: more tests
})
