/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import MenuItem from 'material-ui/MenuItem'

jest.mock('js/navigation/navigation')

const getMockProps = () => ({
  anchorElement: <div>hi</div>,
  isUserAnonymous: false,
  open: true,
  onClose: () => {},
  onLogoutClick: () => {},
})

describe('SettingsDropdownComponent', () => {
  it('renders without error', () => {
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SettingsDropdownComponent {...mockProps} />).dive()
  })

  it('contains a "sign out" menu item', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    const hasSignOut =
      wrapper.find(MenuItem).filterWhere(elem => {
        return elem.prop('primaryText') === 'Sign Out'
      }).length === 1
    expect(hasSignOut).toBe(true)
  })

  it('does not contain a "sign out" menu item if the user is anonymous', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = true
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    const hasSignOut =
      wrapper.find(MenuItem).filterWhere(elem => {
        return elem.prop('primaryText') === 'Sign Out'
      }).length === 1
    expect(hasSignOut).toBe(false)
  })
})
