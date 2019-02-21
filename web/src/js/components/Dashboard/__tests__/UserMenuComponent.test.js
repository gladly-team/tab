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
    shallow(<UserMenuComponent {...mockProps} />).dive()
  })
})
