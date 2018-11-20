/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import {
  shallow
} from 'enzyme'
import Typography from '@material-ui/core/Typography'
import DonateHeartsControls from 'js/components/Donate/DonateHeartsControlsContainer'
import LinearProgress from '@material-ui/core/LinearProgress'

const getMockProps = () => ({
  app: {
    charity: {
      vcReceived: 0
    }
  },
  user: {
    vcCurrent: 12
  },
  campaignTitle: 'Some title here!',
  campaignStartDatetime: moment(),
  campaignEndDatetime: moment(),
  heartsGoal: 100,
  showError: jest.fn()
})

describe('Heart donation campaign component', () => {
  it('renders without error', () => {
    const HeartDonationCampaign = require('js/components/Campaign/HeartDonationCampaignComponent').default
    const mockProps = getMockProps()
    shallow(
      <HeartDonationCampaign {...mockProps}>
        <span>Some content</span>
      </HeartDonationCampaign>
    )
  })

  it('displays the provided title', () => {
    const HeartDonationCampaign = require('js/components/Campaign/HeartDonationCampaignComponent').default
    const mockProps = getMockProps()
    mockProps.campaignTitle = 'Hello there!'
    const wrapper = shallow(
      <HeartDonationCampaign {...mockProps}>
        <span>Some content</span>
      </HeartDonationCampaign>
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return n.prop('variant') === 'h6' && n.render().text() === 'Hello there!'
        })
        .length
    ).toBe(1)
  })

  it('passes the expected props to DonateHeartsControls', () => {
    const HeartDonationCampaign = require('js/components/Campaign/HeartDonationCampaignComponent').default
    const mockProps = getMockProps()
    mockProps.campaignTitle = 'Hello there!'
    const wrapper = shallow(
      <HeartDonationCampaign {...mockProps}>
        <span>Some content</span>
      </HeartDonationCampaign>
    )
    const donateControls = wrapper.find(DonateHeartsControls)
    expect(donateControls.prop('charity')).toEqual(mockProps.app.charity)
    expect(donateControls.prop('user')).toEqual(mockProps.user)
  })

  it('displays the Hearts donated so far', () => {
    const HeartDonationCampaign = require('js/components/Campaign/HeartDonationCampaignComponent').default
    const mockProps = getMockProps()
    mockProps.app.charity.vcReceived = 23874
    const wrapper = shallow(
      <HeartDonationCampaign {...mockProps}>
        <span>Some content</span>
      </HeartDonationCampaign>
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return n.render().text() === '23.9K Hearts donated'
        })
        .length
    ).toBe(1)
  })

  it('displays the goal number of Hearts', () => {
    const HeartDonationCampaign = require('js/components/Campaign/HeartDonationCampaignComponent').default
    const mockProps = getMockProps()
    mockProps.heartsGoal = 10e7
    const wrapper = shallow(
      <HeartDonationCampaign {...mockProps}>
        <span>Some content</span>
      </HeartDonationCampaign>
    )
    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => {
          return n.render().text() === 'Goal: 100M'
        })
        .length
    ).toBe(1)
  })

  it('sets the correct value on the progress bar', () => {
    const HeartDonationCampaign = require('js/components/Campaign/HeartDonationCampaignComponent').default
    const mockProps = getMockProps()
    mockProps.heartsGoal = 10e5
    mockProps.app.charity.vcReceived = 250000
    const wrapper = shallow(
      <HeartDonationCampaign {...mockProps}>
        <span>Some content</span>
      </HeartDonationCampaign>
    )
    const progressBar = wrapper.find(LinearProgress)
    expect(progressBar.prop('value')).toEqual(25.0)
  })
})
