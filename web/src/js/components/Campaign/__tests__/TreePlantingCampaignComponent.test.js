/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import TreeIcon from 'mdi-material-ui/PineTree'
import LinearProgress from '@material-ui/core/LinearProgress'
import InviteFriend from 'js/components/Settings/Profile/InviteFriendContainer'
import Link from 'js/components/General/Link'
import { treePlantingCampaignHomepageURL } from 'js/navigation/navigation'

jest.mock('js/components/General/Link')

const mockNow = '2017-05-19T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  MockDate.reset()
})

const getMockProps = () => ({
  app: {
    campaign: {
      numNewUsers: 192,
    },
  },
  user: {
    recruits: {
      totalRecruits: 0,
      recruitsActiveForAtLeastOneDay: 0,
      recruitsWithAtLeastOneTab: 0,
    },
  },
  campaign: {
    time: {
      start: moment('2017-05-12T10:00:00.000Z'),
      end: moment('2017-05-22T10:00:00.000Z'),
    },
    treesPlantedGoal: 20000,
  },
})

describe('Tree planting campaign component', () => {
  it('renders without error', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    shallow(<TreePlantingCampaign {...mockProps} />).dive()
  })

  it('displays the correct title text when the campaign is in progress', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<TreePlantingCampaign {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(e => e.prop('variant') === 'h6')
        .render()
        .text()
    ).toEqual('Recruit a friend, plant a tree')
  })

  it('displays the correct title text when the campaign is complete', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default

    // Mock that now is after the campaign end time.
    MockDate.set(moment('2017-05-23T12:14:00.000Z'))

    const mockProps = getMockProps()
    const wrapper = shallow(<TreePlantingCampaign {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(e => e.prop('variant') === 'h6')
        .render()
        .text()
    ).toEqual('Thanks for planting trees!')
  })

  it('displays no "completed" trees when the user has not recruited any users', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.recruits.recruitsWithAtLeastOneTab = 0
    const wrapper = shallow(<TreePlantingCampaign {...mockProps} />).dive()
    const treeIcons = wrapper.find(TreeIcon)
    treeIcons.forEach(icon => {
      expect(icon.prop('style').color).toEqual('#BBB') // grey
    })
  })

  it('displays one "completed" tree when the user has recruited 1 user', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.recruits.recruitsWithAtLeastOneTab = 1
    const wrapper = shallow(<TreePlantingCampaign {...mockProps} />).dive()
    const treeIcons = wrapper.find(TreeIcon)
    expect(treeIcons.at(0).prop('style').color).toEqual('#f50057') // green
    expect(treeIcons.at(1).prop('style').color).toEqual('#BBB')
    expect(treeIcons.at(2).prop('style').color).toEqual('#BBB')
  })

  it('displays two "completed" trees when the user has recruited 2 users', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.recruits.recruitsWithAtLeastOneTab = 2
    const wrapper = shallow(<TreePlantingCampaign {...mockProps} />).dive()
    const treeIcons = wrapper.find(TreeIcon)
    expect(treeIcons.at(0).prop('style').color).toEqual('#f50057') // green
    expect(treeIcons.at(1).prop('style').color).toEqual('#f50057') // green
    expect(treeIcons.at(2).prop('style').color).toEqual('#BBB')
  })

  it('displays all "completed" trees when the user has recruited 3 users', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.recruits.recruitsWithAtLeastOneTab = 3
    const wrapper = shallow(<TreePlantingCampaign {...mockProps} />).dive()
    const treeIcons = wrapper.find(TreeIcon)
    treeIcons.forEach(icon => {
      expect(icon.prop('style').color).toEqual('#f50057') // green
    })
  })

  it('displays the "invite friend" component when the campaign is in progress', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<TreePlantingCampaign {...mockProps} />).dive()
    const comp = wrapper.find(InviteFriend)
    expect(comp.exists()).toBe(true)
    expect(comp.prop('label')).toBe('Share this link with a friend')
    expect(comp.prop('helperText')).toBe(
      "and you'll plant a tree when they join!"
    )
  })

  it('does not display the "invite friend" component when the campaign is complete', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default

    // Mock that now is after the campaign end time.
    MockDate.set(moment('2017-05-23T12:14:00.000Z'))

    const mockProps = getMockProps()
    const wrapper = shallow(<TreePlantingCampaign {...mockProps} />).dive()
    const comp = wrapper.find(InviteFriend)
    expect(comp.exists()).toBe(false)
  })

  it('displays the expected text when the campaign is in progress', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<TreePlantingCampaign {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(e => e.prop('variant') === 'body2')
        .last()
        .render()
        .text()
    ).toEqual(
      "Now until January 10, we're planting a tree for every person who joins Tab for a Cause!"
    )
  })

  it('displays the expected text when the campaign is complete', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default

    // Mock that now is after the campaign end time.
    MockDate.set(moment('2017-05-23T12:14:00.000Z'))

    const mockProps = getMockProps()
    const wrapper = shallow(<TreePlantingCampaign {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(e => e.prop('variant') === 'body2')
        .last()
        .render()
        .text()
    ).toEqual(
      'Together, we planted 192 trees this holiday season! Great job, and thank you for spreading the word about Tab for a Cause!'
    )
  })

  it('links to the tree planting FAQ page', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<TreePlantingCampaign {...mockProps} />).dive()
    const link = wrapper.find(Link)
    expect(link.prop('to')).toEqual(treePlantingCampaignHomepageURL)
    expect(link.render().text()).toEqual("we're planting a tree")
  })

  it('sets the correct value on the progress bar', () => {
    const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.campaign.treesPlantedGoal = 30000
    mockProps.app.campaign.numNewUsers = 6000
    const wrapper = shallow(<TreePlantingCampaign {...mockProps} />).dive()
    const progressBar = wrapper.find(LinearProgress)
    expect(progressBar.prop('value')).toEqual(20)
  })
})
