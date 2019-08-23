/* eslint-env jest */

import React from 'react'
import { Helmet } from 'react-helmet'
import { shallow } from 'enzyme'
import moment from 'moment'
import MockDate from 'mockdate'
import Stat from 'js/components/Settings/Profile/StatComponent'
import Typography from '@material-ui/core/Typography'
import { goTo, donateURL, inviteFriendsURL } from 'js/navigation/navigation'

jest.mock('@material-ui/icons/FavoriteBorder', () => () => '[HEART-ICON] ')
jest.mock('js/navigation/navigation')

const mockNow = '2019-05-19T13:59:58.000Z'

beforeAll(() => {
  MockDate.set(moment(mockNow))
})

beforeEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  MockDate.reset()
})

const getMockProps = () => ({
  user: {
    id: 'some-user-id-here',
    username: 'Bob',
    heartsUntilNextLevel: 23,
    joined: '2017-12-25T07:08:11.472Z',
    level: 8,
    maxTabsDay: {
      date: '2018-01-01T10:50:44.942Z',
      numTabs: 431,
    },
    numUsersRecruited: 2,
    tabs: 3121,
    vcDonatedAllTime: 2539,
  },
})

describe('Profile stats component', () => {
  it('renders without error', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    shallow(<ProfileStatsComponent {...mockProps} />).dive()
  })

  it('sets the the page title', async () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(Helmet)
        .find('title')
        .first()
        .text()
    ).toEqual('Your Stats')
  })

  it('has the expected number of stats', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />).dive()
    expect(wrapper.find(Stat).length).toBe(6)
  })

  it('contains the correct greeting text when there is a username', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual("Hi, Bob! Here's all your great work Tabbing, by the numbers.")
  })

  it('contains the correct greeting when there is no username', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.username = undefined
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual("Hi! Here's all your great work Tabbing, by the numbers.")
  })

  it('shows the correct "days since joining" stat', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.joined = '2017-12-25T07:08:11.472Z'
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />).dive()
    const statElem = wrapper.find(Stat).first()
    expect(statElem.prop('stat')).toEqual('510')
    expect(statElem.prop('statText')).toEqual('days as a Tabber')
  })

  it('shows the correct "days since joining" stat when it is only one day', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.joined = '2019-05-18T08:00:58.000Z'
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />).dive()
    const statElem = wrapper.find(Stat).first()
    expect(statElem.prop('stat')).toEqual('1')
    expect(statElem.prop('statText')).toEqual('day as a Tabber')
  })

  it('shows the correct "tabs all time" stat', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.tabs = 3121
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />).dive()
    const statElem = wrapper.find(Stat).at(1)
    expect(statElem.prop('stat')).toEqual('3.1K')
    expect(statElem.prop('statText')).toEqual('tabs all time')
  })

  it('shows the correct "max tabs in one day" stat', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.maxTabsDay = {
      date: '2018-01-01T10:50:44.942Z',
      numTabs: 431,
    }
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />).dive()
    const statElem = wrapper.find(Stat).at(2)
    expect(statElem.prop('stat')).toEqual('431')
    expect(statElem.prop('statText')).toEqual('max tabs in one day')
    expect(
      shallow(statElem.prop('extraContent'))
        .render()
        .text()
    ).toEqual('on January 1, 2018')
  })

  it('shows the correct "level" stat', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.heartsUntilNextLevel = 23
    mockProps.user.level = 8
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />).dive()
    const statElem = wrapper.find(Stat).at(3)
    expect(statElem.prop('stat')).toEqual(8)
    expect(statElem.prop('statText')).toEqual('your level')
    expect(
      shallow(statElem.prop('extraContent'))
        .render()
        .text()
    ).toEqual('23[HEART-ICON] until next level')
  })

  it('shows the correct "friends recruited" stat', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.numUsersRecruited = 2
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />).dive()
    const statElem = wrapper.find(Stat).at(4)
    expect(statElem.prop('stat')).toEqual('2')
    expect(statElem.prop('statText')).toEqual('Tabbers recruited')
  })

  it('goes to the "invite friends" page when clicking the button below the "friends recruited" stat', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />).dive()
    const statElem = wrapper.find(Stat).at(4)
    expect(statElem.prop('statText')).toEqual('Tabbers recruited')
    const extraStatContent = shallow(statElem.prop('extraContent'))
    extraStatContent.at(0).simulate('click')
    expect(goTo).toHaveBeenCalledTimes(1)
    expect(goTo).toHaveBeenCalledWith(inviteFriendsURL)
  })

  it('shows the correct "Hearts donated" stat', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.vcDonatedAllTime = 2539
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />).dive()
    const statElem = wrapper.find(Stat).at(5)
    expect(statElem.prop('stat')).toEqual('2.5K')
    expect(statElem.prop('statText')).toEqual('Hearts donated')
  })

  it('goes to the "donate Hearts" page when clicking the button below the "Hearts donated" stat', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />).dive()
    const statElem = wrapper.find(Stat).at(5)
    expect(statElem.prop('statText')).toEqual('Hearts donated')
    const extraStatContent = shallow(statElem.prop('extraContent'))
    extraStatContent.at(0).simulate('click')
    expect(goTo).toHaveBeenCalledTimes(1)
    expect(goTo).toHaveBeenCalledWith(donateURL)
  })
})
