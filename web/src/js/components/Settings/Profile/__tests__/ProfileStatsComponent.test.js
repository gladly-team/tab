/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

const mockProps = {
  user: {
    id: 'some-user-id-here',
    username: 'Bob',
    heartsUntilNextLevel: 23,
    joined: '2017-12-25T07:08:11.472Z',
    level: 8,
    maxTabsDay: {
      date: '2018-01-01T10:50:44.942Z',
      numTabs: 431
    },
    numUsersRecruited: 2,
    tabs: 3121,
    vcDonatedAllTime: 2539
  }
}

describe('Profile stats component', () => {
  it('renders without error', () => {
    const ProfileStatsComponent = require('../ProfileStatsComponent').default
    shallow(
      <ProfileStatsComponent {...mockProps} />
    )
  })
})
