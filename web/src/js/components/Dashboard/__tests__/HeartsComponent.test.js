/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  user: {
    tabsToday: 31,
    vcCurrent: 482,
  },
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('HeartsComponent', () => {
  it('renders without error', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    shallow(<HeartsComponent {...mockProps} />).dive()
  })

  it('contains an ID for the new user tour (to showcase hearts)', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()

    // Important: other code relies on the data-tour-id to show the
    // new user tour. Do not change it without updating it elsewhere.
    expect(wrapper.find('[data-tour-id="hearts"]').length).toBe(1)
  })
})
