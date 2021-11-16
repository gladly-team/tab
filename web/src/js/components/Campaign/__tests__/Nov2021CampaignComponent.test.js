/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import AppleIcon from 'mdi-material-ui/FoodApple'
import LinearProgress from '@material-ui/core/LinearProgress'
import InviteFriend from 'js/components/Settings/Profile/InviteFriendContainer'

jest.mock('js/components/General/Link')

const mockNow = '2017-05-19T13:59:58.000Z'

const ICON_COLOR_COMPLETED = '#C41E3A' // red
const ICON_COLOR_NOT_COMPLETED = '#BBB'

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  MockDate.reset()
})

const getMockProps = () => ({
  app: {
    campaign: {
      goal: {
        currentNumber: 192,
      },
    },
  },
  user: {
    recruits: {
      recruitsWithAtLeastOneTab: 0,
    },
  },
  campaign: {
    time: {
      start: moment('2017-05-12T10:00:00.000Z'),
      end: moment('2017-05-22T10:00:00.000Z'),
    },
    goal: 20000,
  },
  onDismiss: () => {},
})

describe('Nov2021 campaign component', () => {
  it('renders without error', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    shallow(<CustomCampaign {...mockProps} />).dive()
  })

  it('displays the correct title text when the campaign is in progress', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(e => e.prop('variant') === 'h6')
        .render()
        .text()
    ).toEqual('Recruit a friend, feed a child in need')
  })

  it('displays the correct title text when the campaign is complete', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default

    // Mock that now is after the campaign end time.
    MockDate.set(moment('2017-05-23T12:14:00.000Z'))

    const mockProps = getMockProps()
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(e => e.prop('variant') === 'h6')
        .render()
        .text()
    ).toEqual('Thank you for keeping kids fed!')
  })

  it('displays no "completed" goal icons when the user has not recruited any users', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.recruits.recruitsWithAtLeastOneTab = 0
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    const goalIcons = wrapper.find(AppleIcon)
    goalIcons.forEach(icon => {
      expect(icon.prop('style').color).toEqual(ICON_COLOR_NOT_COMPLETED)
    })
  })

  it('displays one "completed" icon when the user has recruited 1 user', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.recruits.recruitsWithAtLeastOneTab = 1
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    const goalIcons = wrapper.find(AppleIcon)
    expect(goalIcons.at(0).prop('style').color).toEqual(ICON_COLOR_COMPLETED)
    expect(goalIcons.at(1).prop('style').color).toEqual(
      ICON_COLOR_NOT_COMPLETED
    )
    expect(goalIcons.at(2).prop('style').color).toEqual(
      ICON_COLOR_NOT_COMPLETED
    )
  })

  it('displays two "completed" icons when the user has recruited 2 users', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.recruits.recruitsWithAtLeastOneTab = 2
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    const goalIcons = wrapper.find(AppleIcon)
    expect(goalIcons.at(0).prop('style').color).toEqual(ICON_COLOR_COMPLETED)
    expect(goalIcons.at(1).prop('style').color).toEqual(ICON_COLOR_COMPLETED)
    expect(goalIcons.at(2).prop('style').color).toEqual(
      ICON_COLOR_NOT_COMPLETED
    )
  })

  it('displays all "completed" icons when the user has recruited 3 users', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.recruits.recruitsWithAtLeastOneTab = 3
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    const goalIcons = wrapper.find(AppleIcon)
    goalIcons.forEach(icon => {
      expect(icon.prop('style').color).toEqual(ICON_COLOR_COMPLETED)
    })
  })

  it('displays the "invite friend" component when the campaign is in progress', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    const comp = wrapper.find(InviteFriend)
    expect(comp.exists()).toBe(true)
    expect(comp.prop('label')).toBe('Share this link with a friend')
    expect(comp.prop('helperText')).toBe(
      "and they'll feed a kid when they join!"
    )
  })

  it('does not display the "invite friend" component when the campaign is complete', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default

    // Mock that now is after the campaign end time.
    MockDate.set(moment('2017-05-23T12:14:00.000Z'))

    const mockProps = getMockProps()
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    const comp = wrapper.find(InviteFriend)
    expect(comp.exists()).toBe(false)
  })

  it('displays the expected text when the campaign is in progress', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(e => e.prop('variant') === 'body2')
        .last()
        .render()
        .text()
    ).toMatch(/Now until December 6, we're giving a child a meal/)
  })

  it('displays the expected text when the campaign is complete', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default

    // Mock that now is after the campaign end time.
    MockDate.set(moment('2017-05-23T12:14:00.000Z'))

    const mockProps = getMockProps()
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(e => e.prop('variant') === 'body2')
        .first()
        .render()
        .text()
    ).toMatch(/Thank you for joining us in keeping kids fed/)
  })

  it('sets the correct value on the progress bar', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.campaign.goal = 30000
    mockProps.app.campaign.goal.currentNumber = 6000
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    const progressBar = wrapper.find(LinearProgress)
    expect(progressBar.prop('value')).toEqual(20)
  })

  it('displays the expected text above the progress bar when the campaign is live and zero trees have been planted', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.app.campaign.goal.currentNumber = 0
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    const progressBarContainer = wrapper.find(
      '[data-test-id="custom-campaign-progress-bar"]'
    )
    expect(
      progressBarContainer
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('0 meals provided')
  })

  it('displays the expected text above the progress bar when the campaign is live and one kid has been fed', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.app.campaign.goal.currentNumber = 10
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    const progressBarContainer = wrapper.find(
      '[data-test-id="custom-campaign-progress-bar"]'
    )
    expect(
      progressBarContainer
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('10 meals provided')
  })

  it('displays the expected text above the progress bar when the campaign is live and 10 kids have been fed', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.app.campaign.goal.currentNumber = 20
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    const progressBarContainer = wrapper.find(
      '[data-test-id="custom-campaign-progress-bar"]'
    )
    expect(
      progressBarContainer
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('20 meals provided')
  })

  it('displays the expected text above the progress bar when the campaign is live and a large number of trees have been planted', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.app.campaign.goal.currentNumber = 38911
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    const progressBarContainer = wrapper.find(
      '[data-test-id="custom-campaign-progress-bar"]'
    )
    expect(
      progressBarContainer
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('38.9K meals provided')
  })

  it('displays the expected "goal" text above the progress bar', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default
    const mockProps = getMockProps()
    mockProps.campaign.goal = 35000
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    const progressBarContainer = wrapper.find(
      '[data-test-id="custom-campaign-progress-bar"]'
    )
    expect(
      progressBarContainer
        .find(Typography)
        .last()
        .render()
        .text()
    ).toEqual('Goal: 35K')
  })

  it('still displays text above the progress bar when the campaign has ended', () => {
    const CustomCampaign = require('js/components/Campaign/Nov2021CampaignComponent')
      .default

    // Mock that now is after the campaign end time.
    MockDate.set(moment('2017-05-23T12:14:00.000Z'))

    const mockProps = getMockProps()
    const wrapper = shallow(<CustomCampaign {...mockProps} />).dive()
    const progressBarContainer = wrapper.find(
      '[data-test-id="custom-campaign-progress-bar"]'
    )
    expect(progressBarContainer.find(Typography).exists()).toBe(true)
  })
})
