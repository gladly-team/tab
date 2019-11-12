/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import DonateHeartsControls from 'js/components/Donate/DonateHeartsControlsContainer'
import LinearProgress from '@material-ui/core/LinearProgress'

const mockNow = '2017-05-19T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  MockDate.reset()
})

const getMockProps = () => ({
  app: {
    charity: {
      vcReceived: 0,
    },
  },
  user: {
    vcCurrent: 12,
  },
  campaign: {
    time: {
      start: moment('2017-05-12T10:00:00.000Z'),
      end: moment('2017-05-22T10:00:00.000Z'),
    },
    heartsGoal: 100,
    endContent: <span>hi</span>,
  },
  showError: jest.fn(),
})

describe('Tree planting campaign component', () => {
  it('renders without error', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    shallow(
      <TreePlantingCampaign {...mockProps}>
        <span>Some content</span>
      </TreePlantingCampaign>
    )
  })

  it('displays the provided children during the campaign', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <TreePlantingCampaign {...mockProps}>
        <span>Some content</span>
      </TreePlantingCampaign>
    )
    expect(
      wrapper.find('span').filterWhere(n => {
        return n.text() === 'Some content'
      }).length
    ).toBe(1)
  })

  it('passes the expected props to DonateHeartsControls', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <TreePlantingCampaign {...mockProps}>
        <span>Some content</span>
      </TreePlantingCampaign>
    )
    const donateControls = wrapper.find(DonateHeartsControls)
    expect(donateControls.props()).toEqual({
      user: mockProps.user,
      charity: mockProps.app.charity,
      heartDonationCampaign: {
        time: {
          start: mockProps.campaign.time.start,
          end: mockProps.campaign.time.end,
        },
      },
      showError: expect.any(Function),
    })
  })

  it('displays the Hearts donated so far', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.app.charity.vcReceived = 23874
    const wrapper = shallow(
      <TreePlantingCampaign {...mockProps}>
        <span>Some content</span>
      </TreePlantingCampaign>
    )
    expect(
      wrapper.find(Typography).filterWhere(n => {
        return n.render().text() === '23.9K Hearts donated'
      }).length
    ).toBe(1)
  })

  it('displays the goal number of Hearts', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.campaign.heartsGoal = 10e7
    const wrapper = shallow(
      <TreePlantingCampaign {...mockProps}>
        <span>Some content</span>
      </TreePlantingCampaign>
    )
    expect(
      wrapper.find(Typography).filterWhere(n => {
        return n.render().text() === 'Goal: 100M'
      }).length
    ).toBe(1)
  })

  it('sets the correct value on the progress bar', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.campaign.heartsGoal = 10e5
    mockProps.app.charity.vcReceived = 250000
    const wrapper = shallow(
      <TreePlantingCampaign {...mockProps}>
        <span>Some content</span>
      </TreePlantingCampaign>
    )
    const progressBar = wrapper.find(LinearProgress)
    expect(progressBar.prop('value')).toEqual(25.0)
  })

  it('displays the provided children after the campaign has ended if no "end content" is provided', () => {
    const afterCampaignTime = '2017-05-28T12:11:10.000Z'
    MockDate.set(moment(afterCampaignTime))
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.campaign.endContent = null
    const wrapper = shallow(
      <TreePlantingCampaign {...mockProps}>
        <span>Some content</span>
      </TreePlantingCampaign>
    )
    expect(
      wrapper.find('span').filterWhere(n => {
        return n.text() === 'Some content'
      }).length
    ).toBe(1)
  })

  it('displays the "end content" after the campaign has ended', () => {
    const afterCampaignTime = '2017-05-28T12:11:10.000Z'
    MockDate.set(moment(afterCampaignTime))
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.campaign.endContent = <span>The campaign has ended!</span>
    const wrapper = shallow(
      <TreePlantingCampaign {...mockProps}>
        <span>Some content</span>
      </TreePlantingCampaign>
    )
    expect(
      wrapper.find('span').filterWhere(n => {
        return n.text() === 'The campaign has ended!'
      }).length
    ).toBe(1)
  })

  it('does not render the DonateHeartsControls after the campaign has ended', () => {
    const afterCampaignTime = '2017-05-28T12:11:10.000Z'
    MockDate.set(moment(afterCampaignTime))
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <TreePlantingCampaign {...mockProps}>
        <span>Some content</span>
      </TreePlantingCampaign>
    )
    expect(wrapper.find(DonateHeartsControls).length).toBe(0)
  })

  it('hides the the "Hearts donated so far" and "goal Hearts" text after the campaign has ended', () => {
    const afterCampaignTime = '2017-05-28T12:11:10.000Z'
    MockDate.set(moment(afterCampaignTime))
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.app.charity.vcReceived = 23874
    mockProps.campaign.heartsGoal = 10e7
    const wrapper = shallow(
      <TreePlantingCampaign {...mockProps}>
        <span>Some content</span>
      </TreePlantingCampaign>
    )
    expect(
      wrapper.find(Typography).filterWhere(n => {
        return n.render().text() === '23.9K Hearts donated'
      }).length
    ).toBe(0)
    expect(
      wrapper.find(Typography).filterWhere(n => {
        return n.render().text() === 'Goal: 100M'
      }).length
    ).toBe(0)
  })

  it('shows a new "Hearts donated so far" and "goal Hearts" message after the campaign has ended', () => {
    const afterCampaignTime = '2017-05-28T12:11:10.000Z'
    MockDate.set(moment(afterCampaignTime))
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.app.charity.vcReceived = 12403011
    mockProps.campaign.heartsGoal = 10e7
    const wrapper = shallow(
      <TreePlantingCampaign {...mockProps}>
        <span>Some content</span>
      </TreePlantingCampaign>
    )
    expect(
      wrapper.find(Typography).filterWhere(n => {
        return (
          n.render().text() ===
          'Great job! Together, we donated 12.4M Hearts of our 100M goal.'
        )
      }).length
    ).toBe(1)
  })
})
