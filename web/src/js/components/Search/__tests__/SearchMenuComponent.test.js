/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Hearts from 'js/components/Search/SearchHeartsContainer'
import Button from '@material-ui/core/Button'
import CircleIcon from '@material-ui/icons/Lens'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import SettingsButton from 'js/components/Dashboard/SettingsButtonComponent'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import Link from 'js/components/General/Link'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import {
  searchDonateHeartsURL,
  searchExternalHelpURL,
  searchInviteFriendsURL,
} from 'js/navigation/navigation'
import { logout } from 'js/authentication/user'
import { goToLogin } from 'js/navigation/navigation'
import logger from 'js/utils/logger'

jest.mock('@material-ui/icons/FavoriteBorder', () => () => '[heart icon]')
jest.mock('js/components/Search/SearchHeartsContainer')
jest.mock('js/components/Dashboard/SettingsButtonComponent')
jest.mock('js/components/MoneyRaised/MoneyRaisedContainer')
jest.mock('js/components/General/Link')
jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')
jest.mock('js/utils/logger')

const getMockProps = () => ({
  app: {
    moneyRaised: 610234.56,
    dollarsPerDayRate: 500.0,
  },
  isSearchExtensionInstalled: true,
  user: null,
})

const getMockUserData = () => ({
  vcDonatedAllTime: 1201,
})

describe('SearchMenuComponent', () => {
  it('renders without error', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SearchMenuComponent {...mockProps} />)
  })

  it('assigns styles to the root element', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.style = {
      display: 'inline',
      color: 'green',
    }
    const wrapper = mount(<SearchMenuComponent {...mockProps} />)
    const elem = wrapper.getDOMNode()
    const elemStyle = window.getComputedStyle(elem)
    expect(elemStyle.display).toBe('inline')
    expect(elemStyle.color).toBe('green')
  })

  it('renders the MoneyRaised component even when there is no user', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = null
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(MoneyRaised).exists()).toBe(true)
  })

  it('does not show the Hearts component if there is no user', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = null
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(Hearts).exists()).toBe(false)
  })

  it('shows the Hearts component if there is a user', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(Hearts).exists()).toBe(true)
  })

  it('sets the "showMaxHeartsFromSearchesMessage" to true on the Hearts component', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(Hearts).prop('showMaxHeartsFromSearchesMessage')).toBe(
      true
    )
  })

  it('does not show the CircleIcon component if there is no user and the user has not installed the extension', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.isSearchExtensionInstalled = false
    mockProps.user = null
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(CircleIcon).exists()).toBe(false)
  })

  it('shows the CircleIcon component if there is no user but the user has installed the extension (so we should show the sign-in button)', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.isSearchExtensionInstalled = true
    mockProps.user = null
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(CircleIcon).exists()).toBe(true)
  })

  it('shows the CircleIcon component if there is a user', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(CircleIcon).exists()).toBe(true)
  })

  it('does not show the SettingsButton component if there is no user', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = null
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(SettingsButton).exists()).toBe(false)
  })

  it('shows the SettingsButton component if there is a user', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(SettingsButton).exists()).toBe(true)
  })

  it('shows the "sign in" button component if the user is not signed in and already installed the extension', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.isSearchExtensionInstalled = true
    mockProps.user = null
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="search-sign-in-link"]').exists()).toBe(
      true
    )
  })

  it('does not show the "sign in" button component if the user is already signed in', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.isSearchExtensionInstalled = true
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="search-sign-in-link"]').exists()).toBe(
      false
    )
  })

  it('does not show the "sign in" button component if the user has not yet installed the extension (even if the user is not signed in)', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.isSearchExtensionInstalled = false
    mockProps.user = undefined
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="search-sign-in-link"]').exists()).toBe(
      false
    )
  })

  it('links the "sign in" button to the expected auth URL', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.isSearchExtensionInstalled = true
    mockProps.user = null
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const elem = wrapper.find('[data-test-id="search-sign-in-link"]')
    expect(elem.type()).toEqual(Link)
    expect(elem.prop('to')).toEqual('/search/auth/')
  })

  it('shows the expected text in the "sign in" button', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.isSearchExtensionInstalled = true
    mockProps.user = null
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-sign-in-link"]')
        .find(Button)
        .render()
        .text()
    ).toEqual('Sign in')
  })

  it('sets the expected theme typography h2 values', () => {
    const mockProps = getMockProps()
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.typography.h2).toMatchObject({
      color: 'rgba(0, 0, 0, 0.66)',
      fontSize: 22,
    })
  })

  it('sets the expected theme overrides.MuiSvgIcon.root values', () => {
    const mockProps = getMockProps()
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.overrides.MuiSvgIcon.root).toMatchObject({
      color: 'rgba(0, 0, 0, 0.66)',
      fontSize: 22,
    })
  })

  it('sets the expected theme overrides.MuiTypography.h2 values', () => {
    const mockProps = getMockProps()
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.overrides.MuiTypography.h2).toMatchObject({
      '&:hover': {
        color: 'rgba(0, 0, 0, 0.87)',
      },
    })
  })
})

describe('SearchMenuComponent: Hearts dropdown component', () => {
  it('receives the renderProp arguments for open, onClose, and anchorElement', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const mockOnClose = () => {
      console.log('hi')
    }
    const mockAnchorElement = <span>hi</span>
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const heartsElem = wrapper.find(Hearts)
    const dropdownElem = heartsElem.renderProp('dropdown')({
      open: true,
      onClose: mockOnClose,
      anchorElement: mockAnchorElement,
    })
    expect(dropdownElem.prop('open')).toBe(true)
    expect(dropdownElem.prop('onClose')).toBe(mockOnClose)
    expect(dropdownElem.prop('anchorEl')).toBe(mockAnchorElement)
  })

  it('sets a marginTop', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const heartsElem = wrapper.find(Hearts)
    const dropdownElem = heartsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: heartsElem,
    })
    expect(dropdownElem.prop('style')).toHaveProperty('marginTop', 6)
  })

  it('displays the expected "donate hearts" text', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    mockProps.user.vcDonatedAllTime = 3002
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const heartsElem = wrapper.find(Hearts)
    const dropdownElem = heartsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: heartsElem,
    })
    const elem = dropdownElem
      .find(Typography)
      .filterWhere(
        n =>
          n
            .render()
            .text()
            .indexOf('donated') > -1
      )
      .parent()
    expect(elem.render().text()).toEqual('3,002[heart icon]donated')
  })

  it('shows a "donate hearts" button that links to the donate hearts page', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const heartsElem = wrapper.find(Hearts)
    const dropdownElem = heartsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: heartsElem,
    })
    const linkElem = dropdownElem.find(Link).first()
    expect(linkElem.prop('to')).toEqual(searchDonateHeartsURL)
    expect(
      linkElem
        .children()
        .first()
        .render()
        .text()
    ).toEqual('Donate Hearts')
  })
})

describe('SearchMenuComponent: settings dropdown component', () => {
  it('receives the renderProp arguments for open, onClose, and anchorElement', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const mockOnClose = () => {
      console.log('hi')
    }
    const mockAnchorElement = <span>hi</span>
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: true,
      onClose: mockOnClose,
      anchorElement: mockAnchorElement,
    })
    expect(dropdownElem.prop('open')).toBe(true)
    expect(dropdownElem.prop('onClose')).toBe(mockOnClose)
    expect(dropdownElem.prop('anchorEl')).toBe(mockAnchorElement)
  })

  it('sets a marginTop', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })
    expect(dropdownElem.prop('style')).toHaveProperty('marginTop', 6)
  })

  it('has the expected width', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })
    expect(
      dropdownElem
        .find(DashboardPopover)
        .children()
        .first()
        .prop('style').width
    ).toBe(200)
  })

  it('contains a "donate hearts" menu item', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })
    const elem = dropdownElem.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Donate Hearts'
    })
    expect(elem.exists()).toBe(true)
  })

  it('the "donate hearts" menu items links to the correct URL', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })
    const elem = dropdownElem.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Donate Hearts'
    })
    expect(elem.parent().type()).toEqual(Link)
    expect(elem.parent().prop('to')).toEqual(searchDonateHeartsURL)
  })

  it('contains an "invite friends" menu item', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })
    const elem = dropdownElem.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Invite Friends'
    })
    expect(elem.exists()).toBe(true)
  })

  it('the "invite friends" menu items links to the correct URL', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })
    const elem = dropdownElem.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Invite Friends'
    })
    expect(elem.parent().type()).toEqual(Link)
    expect(elem.parent().prop('to')).toEqual(searchInviteFriendsURL)
  })

  it('contains an "help" menu item', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })
    const elem = dropdownElem.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Help'
    })
    expect(elem.exists()).toBe(true)
  })

  it('the "help" menu items links to the correct URL', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })
    const elem = dropdownElem.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Help'
    })
    expect(elem.parent().type()).toEqual(Link)
    expect(elem.parent().prop('to')).toEqual(searchExternalHelpURL)
  })

  it('contains an "sign out" menu item', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })
    const elem = dropdownElem.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Sign Out'
    })
    expect(elem.exists()).toBe(true)
  })

  it('calls to log out when the "sign out" button is clicked', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })
    const elem = dropdownElem.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Sign Out'
    })
    elem.simulate('click')
    expect(logout).toHaveBeenCalled()
  })

  it('redirects to the login page on a successful logout', done => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    logout.mockResolvedValueOnce(true)
    goToLogin.mockImplementationOnce(async () => {
      done()
    })
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })
    const elem = dropdownElem.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Sign Out'
    })
    elem.simulate('click')
  })

  it('logs an error on a failed logout', done => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = getMockUserData()
    logout.mockImplementationOnce(async () => {
      throw new Error('Uh oh :(')
    })
    logger.error.mockImplementationOnce(async () => {
      done()
    })
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })
    const elem = dropdownElem.find(MenuItem).filterWhere(elem => {
      return elem.render().text() === 'Sign Out'
    })
    elem.simulate('click')
  })
})
