/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import { shallow } from 'enzyme'
// import Typography from '@material-ui/core/Typography'
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
    endContent: <span>hi</span>,
    treesPlantedGoal: 20000,
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

  // TODO: progress bar for trees planted
  // it('sets the correct value on the progress bar', () => {
  //   const TreePlantingCampaign = require('js/components/Campaign/TreePlantingCampaignComponent')
  //     .default
  //   const mockProps = getMockProps()
  //   mockProps.campaign.heartsGoal = 10e5
  //   mockProps.app.charity.vcReceived = 250000
  //   const wrapper = shallow(
  //     <TreePlantingCampaign {...mockProps}>
  //       <span>Some content</span>
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
  //         <span>Some content</span>
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
  //         <span>Some content</span>
  //       </TreePlantingCampaign>
  //     )
  //     expect(
  //       wrapper.find('span').filterWhere(n => {
  //         return n.text() === 'The campaign has ended!'
  //       }).length
  //     ).toBe(1)
  //   })
})
