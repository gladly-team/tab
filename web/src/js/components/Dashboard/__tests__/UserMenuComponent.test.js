/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CircleIcon from '@material-ui/icons/Lens'
import Typography from '@material-ui/core/Typography'
import { mountWithHOC } from 'js/utils/test-utils'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import Hearts from 'js/components/Dashboard/HeartsContainer'
import SettingsButton from 'js/components/Dashboard/SettingsButtonComponent'
import { logout } from 'js/authentication/user'
import {
  goTo,
  inviteFriendsURL,
  loginURL,
  searchChromeExtensionPage,
  searchFirefoxExtensionPage,
} from 'js/navigation/navigation'
import logger from 'js/utils/logger'
import Link from 'js/components/General/Link'

jest.mock('js/components/MoneyRaised/MoneyRaisedContainer')
jest.mock('js/components/Dashboard/HeartsContainer')
jest.mock('js/components/Dashboard/HeartsDropdownContainer')
jest.mock('js/components/Dashboard/SettingsButtonComponent')
jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')
jest.mock('js/utils/logger')

const getMockProps = () => {
  return {
    browser: 'chrome',
    user: {},
    app: {},
    isUserAnonymous: false,
    showSparklySearchIntroButton: false,
    onClickSparklySearchIntroButton: jest.fn(),
  }
}

describe('User menu component', () => {
  it('renders without error', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    shallow(<UserMenuComponent {...mockProps} />).dive()
  })

  it('renders the MoneyRaised component', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(MoneyRaised).exists()).toBe(true)
  })

  it('renders the Hearts component', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(Hearts).exists()).toBe(true)
  })

  it('sets the "showMaxHeartsFromTabsMessage" to true on the Hearts component', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(Hearts).prop('showMaxHeartsFromTabsMessage')).toBe(true)
  })

  it('sets the expected color for the circle divider icon', () => {
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<UserMenuComponent {...mockProps} />)
    const typographyComputedStyle = window.getComputedStyle(
      wrapper
        .find(CircleIcon)
        .first()
        .getDOMNode()
    )
    expect(typographyComputedStyle).toHaveProperty(
      'color',
      'rgba(255, 255, 255, 0.8)'
    )
  })

  it('sets the expected theme palette values', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.palette).toMatchObject({
      background: {
        paper: 'rgba(0, 0, 0, 0.36)',
      },
      divider: 'rgba(255, 255, 255, 0.20)',
    })
  })

  it('sets the expected theme typography h2 values', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.typography.h2).toMatchObject({
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 24,
    })
  })

  it('sets the expected theme typography h3 values', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.typography.h3).toMatchObject({
      color: '#fff',
    })
  })

  it('sets the expected theme typography h4 values', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.typography.h4).toMatchObject({
      color: '#fff',
    })
  })

  it('sets the expected theme typography h5 values', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.typography.h5).toMatchObject({
      color: '#fff',
    })
  })

  it('sets the expected theme typography body2 values', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.typography.body2).toMatchObject({
      color: '#fff',
    })
  })

  it('sets the expected theme overrides.MuiListItemIcon.root values', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.overrides.MuiListItemIcon.root).toMatchObject({
      color: '#fff',
    })
  })

  it('sets the expected theme overrides.MuiButtonBase.root values', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.overrides.MuiButtonBase.root).toMatchObject({
      color: '#fff',
    })
  })

  it('sets the expected theme overrides.MuiIconButton.root values', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.overrides.MuiIconButton.root).toMatchObject({
      color: '#fff',
    })
  })

  it('sets the expected theme overrides.MuiSvgIcon.root values', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.overrides.MuiSvgIcon.root).toMatchObject({
      color: '#fff',
      fontSize: 24,
    })
  })

  it('sets the expected theme overrides.MuiTypography.h2 values', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const theme = wrapper.find(MuiThemeProvider).prop('theme')
    expect(theme.overrides.MuiTypography.h2).toMatchObject({
      '&:hover': {
        color: '#fff',
      },
    })
  })
})

describe('User menu component: money raised dropdown component', () => {
  it('receives the renderProp arguments for open, onClose, and anchorElement', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const moneyRaisedElem = wrapper.find(MoneyRaised)
    const mockOnClose = () => {
      console.log('hi')
    }
    const mockAnchorElement = <span>hi</span>
    const dropdownElem = moneyRaisedElem.renderProp('dropdown')({
      open: true,
      onClose: mockOnClose,
      anchorElement: mockAnchorElement,
    })
    expect(dropdownElem.prop('open')).toBe(true)
    expect(dropdownElem.prop('onClose')).toBe(mockOnClose)
    expect(dropdownElem.prop('anchorEl')).toBe(mockAnchorElement)
  })

  it('has the expected copy', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const moneyRaisedElem = wrapper.find(MoneyRaised)
    const dropdownElem = moneyRaisedElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: moneyRaisedElem,
    })
    expect(
      dropdownElem
        .find(Typography)
        .at(0)
        .render()
        .text()
    ).toEqual('This is how much money our community has raised for charity.')
    expect(
      dropdownElem
        .find(Typography)
        .at(1)
        .render()
        .text()
    ).toEqual('Recruit your friends to raise more!')
  })

  it('has a link to invite friends', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const moneyRaisedElem = wrapper.find(MoneyRaised)
    const dropdownElem = moneyRaisedElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: moneyRaisedElem,
    })
    expect(dropdownElem.find(Link).prop('to')).toEqual(inviteFriendsURL)
  })

  it('sets a marginTop', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const moneyRaisedElem = wrapper.find(MoneyRaised)
    const dropdownElem = moneyRaisedElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: moneyRaisedElem,
    })
    expect(dropdownElem.prop('style')).toHaveProperty('marginTop', 6)
  })
})

describe('User menu component: Hearts dropdown component', () => {
  it('receives the "user" and "app" props', () => {
    const mockProps = getMockProps()
    mockProps.app = {
      hi: 'there',
    }
    mockProps.user = {
      some: 'thing',
      abc: 123,
    }
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const heartsElem = wrapper.find(Hearts)
    const dropdownElem = heartsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: heartsElem,
    })
    expect(dropdownElem.prop('app')).toEqual(mockProps.app)
    expect(dropdownElem.prop('user')).toEqual(mockProps.user)
  })

  it('receives the renderProp arguments for open, onClose, and anchorElement', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const heartsElem = wrapper.find(Hearts)
    const mockOnClose = () => {
      console.log('hi')
    }
    const mockAnchorElement = <span>hi</span>
    const dropdownElem = heartsElem.renderProp('dropdown')({
      open: true,
      onClose: mockOnClose,
      anchorElement: mockAnchorElement,
    })
    expect(dropdownElem.prop('open')).toBe(true)
    expect(dropdownElem.prop('onClose')).toBe(mockOnClose)
    expect(dropdownElem.prop('anchorElement')).toBe(mockAnchorElement)
  })

  it('sets a marginTop', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const heartsElem = wrapper.find(Hearts)
    const dropdownElem = heartsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: heartsElem,
    })
    expect(dropdownElem.prop('style')).toHaveProperty('marginTop', 6)
  })
})

describe('User menu component: settings dropdown component', () => {
  it('receives the "isUserAnonymous" prop', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = true
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })
    expect(dropdownElem.prop('isUserAnonymous')).toBe(true)

    mockProps.isUserAnonymous = false
    const wrapper2 = shallow(<UserMenuComponent {...mockProps} />).dive()
    const settingsElem2 = wrapper2.find(SettingsButton)
    const dropdownElem2 = settingsElem2.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem2,
    })
    expect(dropdownElem2.prop('isUserAnonymous')).toBe(false)
  })

  it('receives the renderProp arguments for open, onClose, and anchorElement', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const mockOnClose = () => {
      console.log('hi')
    }
    const mockAnchorElement = <span>hi</span>
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: true,
      onClose: mockOnClose,
      anchorElement: mockAnchorElement,
    })
    expect(dropdownElem.prop('open')).toBe(true)
    expect(dropdownElem.prop('onClose')).toBe(mockOnClose)
    expect(dropdownElem.prop('anchorElement')).toBe(mockAnchorElement)
  })

  it('calls to log out when SettingsDropdown calls onLogoutClick', () => {
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })

    const onLogoutClickFunc = dropdownElem.prop('onLogoutClick')
    onLogoutClickFunc()
    expect(logout).toHaveBeenCalled()
  })

  it('redirects to the login page on a successful logout', done => {
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })

    logout.mockResolvedValueOnce(true)
    goTo.mockImplementationOnce(async url => {
      expect(url).toEqual(loginURL)
      done()
    })
    const onLogoutClickFunc = dropdownElem.prop('onLogoutClick')
    onLogoutClickFunc()
  })

  it('logs an error on a failed logout', done => {
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    const settingsElem = wrapper.find(SettingsButton)
    const dropdownElem = settingsElem.renderProp('dropdown')({
      open: false,
      onClose: () => {},
      anchorElement: settingsElem,
    })

    logout.mockImplementationOnce(async () => {
      throw new Error('Uh oh :(')
    })
    logger.error.mockImplementationOnce(async () => {
      done()
    })
    const onLogoutClickFunc = dropdownElem.prop('onLogoutClick')
    onLogoutClickFunc()
  })
})

describe('User menu component: sparkly search intro button', () => {
  it('shows the sparkly intro button if the showSparklySearchIntroButton prop is true', () => {
    const mockProps = getMockProps()
    mockProps.showSparklySearchIntroButton = true
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    expect(
      wrapper.find('[data-test-id="search-intro-sparkly-button"]').exists()
    ).toBe(true)
  })

  it('does not show the sparkly intro button if the showSparklySearchIntroButton prop is false', () => {
    const mockProps = getMockProps()
    mockProps.showSparklySearchIntroButton = false
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    expect(
      wrapper.find('[data-test-id="search-intro-sparkly-button"]').exists()
    ).toBe(false)
  })

  it('contains the expected text', () => {
    const mockProps = getMockProps()
    mockProps.showSparklySearchIntroButton = true
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-intro-sparkly-button"]')
        .find(Link)
        .render()
        .text()
    ).toEqual('Double your impact')
  })

  it('links to the Chrome Web Store when the browser prop === "chrome"', () => {
    const mockProps = getMockProps()
    mockProps.browser = 'chrome'
    mockProps.showSparklySearchIntroButton = true
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-intro-sparkly-button"]')
        .find(Link)
        .prop('to')
    ).toEqual(searchChromeExtensionPage)
  })

  it('links to the Firefox Addons page when the browser prop === "firefox"', () => {
    const mockProps = getMockProps()
    mockProps.browser = 'firefox'
    mockProps.showSparklySearchIntroButton = true
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-intro-sparkly-button"]')
        .find(Link)
        .prop('to')
    ).toEqual(searchFirefoxExtensionPage)
  })

  it('links to the Chrome Web Store when the browser prop === "unsupported"', () => {
    const mockProps = getMockProps()
    mockProps.browser = 'other'
    mockProps.showSparklySearchIntroButton = true
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-intro-sparkly-button"]')
        .find(Link)
        .prop('to')
    ).toEqual(searchChromeExtensionPage)
  })

  it('calls the onClickSparklySearchIntroButton prop when clicked', () => {
    const mockProps = getMockProps()
    mockProps.showSparklySearchIntroButton = true
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    expect(mockProps.onClickSparklySearchIntroButton).not.toHaveBeenCalled()
    wrapper
      .find('[data-test-id="search-intro-sparkly-button"]')
      .find(Link)
      .simulate('click')
    expect(mockProps.onClickSparklySearchIntroButton).toHaveBeenCalledTimes(1)
  })
})

describe('User menu component: campaign reopen button', () => {
  it('displays the campaign reopen button', () => {
    const mockProps = getMockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="tree-campaign-reopen"]').exists()).toBe(
      true
    )
  })
})
