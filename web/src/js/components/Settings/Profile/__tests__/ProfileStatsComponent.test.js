/* eslint-env jest */

import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { cloneDeep } from 'lodash/lang'
import { mount, shallow } from 'enzyme'
import Stat from 'js/components/Settings/Profile/StatComponent'

const mockProps = {
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
}

describe('Profile stats component', () => {
  it('renders without error', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    shallow(<ProfileStatsComponent {...mockProps} />)
  })

  it('has the expected number of stats', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const wrapper = shallow(<ProfileStatsComponent {...mockProps} />)
    expect(wrapper.find(Stat).length).toBe(6)
  })

  it('contains the correct greeting when there is a username', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    // @material-ui-1-todo: remove MuiThemeProvider wrapper
    const wrapper = mount(
      <MuiThemeProvider>
        <ProfileStatsComponent {...mockProps} />
      </MuiThemeProvider>
    )
    expect(
      wrapper
        .find('p')
        .first()
        .find('span')
        .first()
        .text()
    ).toBe('Hi, Bob!')
  })

  it('contains the correct greeting when there is no username', () => {
    const ProfileStatsComponent = require('js/components/Settings/Profile/ProfileStatsComponent')
      .default
    const newMockProps = cloneDeep(mockProps)
    delete newMockProps.user.username
    const wrapper = mount(
      <MuiThemeProvider>
        <ProfileStatsComponent {...newMockProps} />
      </MuiThemeProvider>
    )
    expect(
      wrapper
        .find('p')
        .first()
        .find('span')
        .first()
        .text()
    ).toBe('Hi!')
  })
})
