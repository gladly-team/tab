/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import Hearts from 'js/components/Search/SearchHeartsContainer'
import Button from '@material-ui/core/Button'
import CircleIcon from '@material-ui/icons/Lens'
import SettingsButton from 'js/components/Dashboard/SettingsButtonComponent'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import Link from 'js/components/General/Link'

jest.mock('react-relay')
jest.mock('js/components/Search/SearchHeartsContainer')
jest.mock('js/components/Dashboard/SettingsButtonComponent')
jest.mock('js/components/MoneyRaised/MoneyRaisedContainer')
jest.mock('js/components/General/Link')

const getMockProps = () => ({
  app: {
    moneyRaised: 610234.56,
    dollarsPerDayRate: 500.0,
  },
  isSearchExtensionInstalled: true,
  user: null,
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
    mockProps.user = {
      tabsToday: 123,
      vcCurrent: 864,
    }
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(Hearts).exists()).toBe(true)
  })

  it('sets the "showMaxHeartsFromSearchesMessage" to true on the Hearts component', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = {
      tabsToday: 123,
      vcCurrent: 864,
    }
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
    mockProps.user = {
      tabsToday: 123,
      vcCurrent: 864,
    }
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
    mockProps.user = {
      tabsToday: 123,
      vcCurrent: 864,
    }
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
    mockProps.user = {
      tabsToday: 123,
      vcCurrent: 864,
    }
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
