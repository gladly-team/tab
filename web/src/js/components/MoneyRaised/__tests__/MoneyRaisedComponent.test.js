/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import { get } from 'lodash/object'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import Link from 'js/components/General/Link'
import { inviteFriendsURL } from 'js/navigation/navigation'

jest.mock('js/navigation/navigation')
jest.mock('js/components/General/Link')

const getMockProps = () => ({
  app: {
    moneyRaised: 650200,
    dollarsPerDayRate: 450,
  },
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('MoneyRaisedComponent', () => {
  it('renders without error', () => {
    const MoneyRaisedComponent = require('js/components/MoneyRaised/MoneyRaisedComponent')
      .default
    const mockProps = getMockProps()
    shallow(<MoneyRaisedComponent {...mockProps} />).dive()
  })

  it('shows the formatted money raised amount', () => {
    const MoneyRaisedComponent = require('js/components/MoneyRaised/MoneyRaisedComponent')
      .default
    const mockProps = getMockProps()
    mockProps.app.moneyRaised = 650200.12
    mockProps.app.dollarsPerDayRate = 10
    const wrapper = shallow(<MoneyRaisedComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('$650,200.12')
  })

  it('increases the money raised amount at the expected rate', () => {
    const MoneyRaisedComponent = require('js/components/MoneyRaised/MoneyRaisedComponent')
      .default
    jest.useFakeTimers()
    const mockProps = getMockProps()
    mockProps.app.moneyRaised = 650200.12
    mockProps.app.dollarsPerDayRate = 1440 // a dollar per minute
    const wrapper = shallow(<MoneyRaisedComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('$650,200.12')
    jest.advanceTimersByTime(3e4) // 30 seconds
    expect(
      wrapper
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('$650,200.62')
    jest.advanceTimersByTime(4000) // 4 seconds
    expect(
      wrapper
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('$650,200.68')
  })

  it('uses the MUI h2 Typography variant (this is important because our nested theme styles the h2 variant)', () => {
    const MoneyRaisedComponent = require('js/components/MoneyRaised/MoneyRaisedComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<MoneyRaisedComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .first()
        .prop('variant')
    ).toEqual('h2')
  })

  it('uses the MUI theme h2 hover color when the dropdown is open', () => {
    const defaultTheme = createMuiTheme()
    const MoneyRaisedComponent = require('js/components/MoneyRaised/MoneyRaisedComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <MuiThemeProvider
        theme={{
          ...defaultTheme,
          overrides: {
            ...defaultTheme.overrides,
            MuiTypography: {
              ...get(defaultTheme, 'overrides.MuiTypography', {}),
              h2: {
                ...get(defaultTheme, 'overrides.MuiTypography.h2', {}),
                '&:hover': {
                  color: 'rgb(200, 100, 40)',
                },
              },
            },
          },
        }}
      >
        <MoneyRaisedComponent {...mockProps} />
      </MuiThemeProvider>
    )
    wrapper.find('[data-test-id="money-raised-button"]').simulate('click')
    const typographyComputedStyle = window.getComputedStyle(
      wrapper
        .find(Typography)
        .first()
        .getDOMNode()
    )
    expect(typographyComputedStyle).toHaveProperty('color', 'rgb(200, 100, 40)')
  })

  it('falls back to "inherit" color if the MUI theme h2 hover color is not defined', () => {
    const defaultTheme = createMuiTheme()
    const MoneyRaisedComponent = require('js/components/MoneyRaised/MoneyRaisedComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <MuiThemeProvider
        theme={{
          ...defaultTheme,
          overrides: {
            ...defaultTheme.overrides,
            MuiTypography: {},
          },
        }}
      >
        <MoneyRaisedComponent {...mockProps} />
      </MuiThemeProvider>
    )
    wrapper.find('[data-test-id="money-raised-button"]').simulate('click')
    expect(
      wrapper
        .find(Typography)
        .first()
        .prop('style')
    ).toHaveProperty('color', 'inherit')
  })

  it('opens the dropdown on click', () => {
    const MoneyRaisedComponent = require('js/components/MoneyRaised/MoneyRaisedComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<MoneyRaisedComponent {...mockProps} />).dive()
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
    wrapper.find('[data-test-id="money-raised-button"]').simulate('click')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(true)
  })

  it('has a link to invite friends in the dropdown', () => {
    const MoneyRaisedComponent = require('js/components/MoneyRaised/MoneyRaisedComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<MoneyRaisedComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(DashboardPopover)
        .children()
        .find(Link)
        .prop('to')
    ).toEqual(inviteFriendsURL)
  })

  it('clears the interval on unmount', () => {
    const MoneyRaisedComponent = require('js/components/MoneyRaised/MoneyRaisedComponent')
      .default
    const mockProps = getMockProps()
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval')
    const wrapper = shallow(<MoneyRaisedComponent {...mockProps} />).dive()
    expect(clearIntervalSpy).not.toHaveBeenCalled()
    wrapper.unmount()
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1)
  })
})
