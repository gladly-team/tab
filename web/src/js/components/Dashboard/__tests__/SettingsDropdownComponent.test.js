/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import MenuItem from '@material-ui/core/MenuItem'
import Link from 'js/components/General/Link'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import {
  goTo,
  donateURL,
  inviteFriendsURL,
  externalHelpURL,
  settingsURL,
  statsURL,
} from 'js/navigation/navigation'

jest.mock('js/navigation/navigation')

const getMockProps = () => ({
  anchorElement: <div>hi</div>,
  isUserAnonymous: false,
  open: true,
  onClose: () => {},
  onLogoutClick: jest.fn(),
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SettingsDropdownComponent', () => {
  it('renders without error', () => {
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SettingsDropdownComponent {...mockProps} />).dive()
  })

  it('has the expected width', () => {
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(DashboardPopover)
        .children()
        .first()
        .prop('style').width
    ).toBe(200)
  })

  it('contains a "settings" menu item', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    expect(
      wrapper.find(MenuItem).filterWhere(elem => {
        return elem.render().text() === 'Settings'
      }).length === 1
    ).toBe(true)
  })

  it('the "settings" menu item navigates to the correct page on click', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    const elem = wrapper.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Settings'
    })
    elem.simulate('click')
    expect(goTo).toHaveBeenCalledWith(settingsURL)
  })

  it('contains a "donate hearts" menu item', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    expect(
      wrapper.find(MenuItem).filterWhere(elem => {
        return elem.render().text() === 'Donate Hearts'
      }).length === 1
    ).toBe(true)
  })

  it('the "donate hearts" menu item navigates to the correct page on click', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    const elem = wrapper.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Donate Hearts'
    })
    elem.simulate('click')
    expect(goTo).toHaveBeenCalledWith(donateURL)
  })

  it('contains a "invite friends" menu item', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    expect(
      wrapper.find(MenuItem).filterWhere(elem => {
        return elem.render().text() === 'Invite Friends'
      }).length === 1
    ).toBe(true)
  })

  it('the "invite friends" menu item navigates to the correct page on click', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    const elem = wrapper.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Invite Friends'
    })
    elem.simulate('click')
    expect(goTo).toHaveBeenCalledWith(inviteFriendsURL)
  })

  it('contains a "your stats" menu item', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    expect(
      wrapper.find(MenuItem).filterWhere(elem => {
        return elem.render().text() === 'Your Stats'
      }).length === 1
    ).toBe(true)
  })

  it('the "your stats" menu item navigates to the correct page on click', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    const elem = wrapper.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Your Stats'
    })
    elem.simulate('click')
    expect(goTo).toHaveBeenCalledWith(statsURL)
  })

  it('contains a "help" menu item', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    expect(
      wrapper.find(MenuItem).filterWhere(elem => {
        return elem.render().text() === 'Help'
      }).length === 1
    ).toBe(true)
  })

  it('the "help" menu item is wrapped in a Link that goes to the external help URL', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    const elem = wrapper.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Help'
    })
    const linkElem = elem.parent()
    expect(linkElem.type()).toEqual(Link)
    expect(linkElem.prop('to')).toEqual(externalHelpURL)
  })

  it('contains a "sign out" menu item when the user is not anonymous', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    const hasSignOut =
      wrapper.find(MenuItem).filterWhere(elem => {
        return elem.render().text() === 'Sign Out'
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
        return elem.render().text() === 'Sign Out'
      }).length === 1
    expect(hasSignOut).toBe(false)
  })

  it('calls the onLogoutClick prop when the "sign out" button is clicked', () => {
    const mockProps = getMockProps()
    const SettingsDropdownComponent = require('js/components/Dashboard/SettingsDropdownComponent')
      .default
    const wrapper = shallow(<SettingsDropdownComponent {...mockProps} />).dive()
    const signOutElem = wrapper.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Sign Out'
    })
    signOutElem.simulate('click')
    expect(mockProps.onLogoutClick).toHaveBeenCalled()
  })
})
