/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CircleIcon from '@material-ui/icons/Lens'
import { mountWithHOC } from 'js/utils/test-utils'
import MoneyRaised from 'js/components/MoneyRaised/MoneyRaisedContainer'
import Hearts from 'js/components/Dashboard/HeartsContainer'
import SettingsButton from 'js/components/Dashboard/SettingsButtonComponent'

jest.mock('js/components/MoneyRaised/MoneyRaisedContainer')
jest.mock('js/components/Dashboard/HeartsContainer')
jest.mock('js/components/Dashboard/SettingsButtonComponent')

const getMockProps = () => {
  return {
    user: {},
    app: {},
    isUserAnonymous: false,
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

  it('passes the isUserAnonymous prop to the SettingsButton component', () => {
    const mockProps = getMockProps()
    mockProps.isUserAnonymous = false
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    const wrapper = shallow(<UserMenuComponent {...mockProps} />).dive()
    expect(wrapper.find(SettingsButton).prop('isUserAnonymous')).toBe(false)
    wrapper.setProps({
      isUserAnonymous: true,
    })
    expect(wrapper.find(SettingsButton).prop('isUserAnonymous')).toBe(true)
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
