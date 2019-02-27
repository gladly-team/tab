/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import Hearts from 'js/components/Dashboard/HeartsContainer'
import CircleIcon from '@material-ui/icons/Lens'
import SettingsButton from 'js/components/Dashboard/SettingsButtonComponent'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'

jest.mock('react-relay')
jest.mock('js/components/Dashboard/HeartsContainer')
jest.mock('js/components/Dashboard/SettingsButtonComponent')
jest.mock('js/components/MoneyRaised/MoneyRaisedContainer')

const getMockProps = () => ({
  app: {
    moneyRaised: 610234.56,
    dollarsPerDayRate: 500.0,
  },
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

  it('does not show the CircleIcon component if there is no user', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user = null
    const wrapper = shallow(<SearchMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(CircleIcon).exists()).toBe(false)
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
})
