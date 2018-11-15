/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

const getMockProps = () => ({
  charity: {
    id: 'some-charity-id',
    image: 'http://static.example.com/img/charities/charity-post-donation-images/acfusa.jpg',
    impact: 'Your donation helps move us one step closer to ending world hunger.',
    name: 'Action Against Hunger',
    website: 'http://www.actionagainsthunger.org/'
  },
  user: {
    id: 'abc123',
    vcCurrent: 23
  },
  showError: jest.fn()
})

describe('DonateHeartsControls component', () => {
  it('renders without error', () => {
    const DonateHeartsControlsComponent = require('js/components/Donate/DonateHeartsControlsComponent').default
    const mockProps = getMockProps()
    shallow(
      <DonateHeartsControlsComponent {...mockProps} />
    )
  })
})
