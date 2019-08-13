/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Stat from 'js/components/Settings/Profile/StatComponent'
import Typography from '@material-ui/core/Typography'

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
})
