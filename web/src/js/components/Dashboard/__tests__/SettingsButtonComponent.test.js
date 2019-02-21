/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  isUserAnonymous: false,
})

describe('SettingsButtonComponent', () => {
  it('renders without error', () => {
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SettingsButtonComponent {...mockProps} />).dive()
  })

  it('contains an ID for the new user tour (to showcase the settings button)', () => {
    const mockProps = getMockProps()
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const wrapper = shallow(<SettingsButtonComponent {...mockProps} />).dive()

    // Important: other code relies on the data-tour-id to show the
    // new user tour. Do not change it without updating it elsewhere.
    expect(wrapper.find('[data-tour-id="settings-button"]').length).toBe(1)
  })
})
