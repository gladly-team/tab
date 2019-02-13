/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  anchorElement: <div>hi</div>,
  app: {
    referralVcReward: 350,
  },
  user: {
    vcCurrent: 120,
    level: 11,
    heartsUntilNextLevel: 40,
    vcDonatedAllTime: 80,
    numUsersRecruited: 2,
    tabsToday: 9,
  },
  open: false,
  onClose: () => {},
})

describe('HeartsDropdownComponent', () => {
  it('renders without error', () => {
    const HeartsDropdownComponent = require('js/components/Dashboard/HeartsDropdownComponent')
      .default
    const mockProps = getMockProps()
    shallow(<HeartsDropdownComponent {...mockProps} />)
  })
})
