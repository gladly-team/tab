/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const MockProps = () => {
  return {
    user: {
      vcCurrent: 32,
      level: 8,
      heartsUntilNextLevel: 14,
      vcDonatedAllTime: 90,
      numUsersRecruited: 1,
      tabsToday: 4,
    },
    app: {
      referralVcReward: 350,
    },
    isUserAnonymous: false,
  }
}

describe('User menu component', () => {
  it('renders without error', () => {
    const mockProps = MockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    shallow(<UserMenuComponent {...mockProps} />)
  })

  it('contains an ID for the new user tour (to showcase hearts)', () => {
    const mockProps = MockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />)

    // Important: other code relies on the data-tour-id to show the
    // new user tour. Do not change it without updating it elsewhere.
    expect(wrapper.find('[data-tour-id="hearts"]').length).toBe(1)
  })

  it('contains an ID for the new user tour (to showcase the settings button)', () => {
    const mockProps = MockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />)

    // Important: other code relies on the data-tour-id to show the
    // new user tour. Do not change it without updating it elsewhere.
    expect(wrapper.find('[data-tour-id="settings-button"]').length).toBe(1)
  })
})
