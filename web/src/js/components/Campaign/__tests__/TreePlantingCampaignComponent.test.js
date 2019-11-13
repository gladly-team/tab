/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import TreeIcon from 'mdi-material-ui/PineTree'
// import LinearProgress from '@material-ui/core/LinearProgress'

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

  // TODO: progress bar for trees planted
  // it('sets the correct value on the progress bar', () => {
  //   const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
  //     .default
  //   const mockProps = getMockProps()
  //   mockProps.campaign.heartsGoal = 10e5
  //   mockProps.app.charity.vcReceived = 250000
  //   const wrapper = shallow(
  //     <TreePlantingCampaign {...mockProps}>
  //     </TreePlantingCampaign>
  //   )
  //   const progressBar = wrapper.find(LinearProgress)
  //   expect(progressBar.prop('value')).toEqual(25.0)
  // })

  // TODO: decide how to handle campaign end

  //   it('displays the provided children after the campaign has ended if no "end content" is provided', () => {
  //     const afterCampaignTime = '2017-05-28T12:11:10.000Z'
  //     MockDate.set(moment(afterCampaignTime))
  //     const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
  //       .default
  //     const mockProps = getMockProps()
  //     mockProps.campaign.endContent = null
  //     const wrapper = shallow(
  //       <TreePlantingCampaign {...mockProps}>
  //       </TreePlantingCampaign>
  //     )
  //     expect(
  //       wrapper.find('span').filterWhere(n => {
  //         return n.text() === 'Some content'
  //       }).length
  //     ).toBe(1)
  //   })
  //
  //   it('displays the "end content" after the campaign has ended', () => {
  //     const afterCampaignTime = '2017-05-28T12:11:10.000Z'
  //     MockDate.set(moment(afterCampaignTime))
  //     const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
  //       .default
  //     const mockProps = getMockProps()
  //     mockProps.campaign.endContent = <span>The campaign has ended!</span>
  //     const wrapper = shallow(
  //       <TreePlantingCampaign {...mockProps}>
  //       </TreePlantingCampaign>
  //     )
  //     expect(
  //       wrapper.find('span').filterWhere(n => {
  //         return n.text() === 'The campaign has ended!'
  //       }).length
  //     ).toBe(1)
  //   })
})
