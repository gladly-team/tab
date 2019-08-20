/* eslint-env jest */

import React from 'react'
import { get } from 'lodash/object'
import { mount, shallow } from 'enzyme'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const getMockProps = () => ({
  dropdown: () => <div />,
  isUserAnonymous: false,
})

afterEach(() => {
  jest.clearAllMocks()
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

  it('opens the dropdown on click', () => {
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const MockDropdown = () => <div />
    const mockProps = getMockProps()
    mockProps.dropdown = args => <MockDropdown {...args} />
    const wrapper = shallow(<SettingsButtonComponent {...mockProps} />).dive()
    expect(wrapper.find(MockDropdown).prop('open')).toBe(false)
    wrapper
      .find('[data-test-id="settings-button"]')
      .first()
      .simulate('click')
    expect(wrapper.find(MockDropdown).prop('open')).toBe(true)
  })

  it('uses the MUI theme h2 color for the settings button icon', () => {
    const defaultTheme = createMuiTheme()
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <MuiThemeProvider
        theme={{
          ...defaultTheme,
          typography: {
            ...defaultTheme.typography,
            h2: {
              ...defaultTheme.typography.h2,
              color: 'rgba(1, 0, 255, 0.44)',
            },
            body2: {
              ...defaultTheme.typography.body2,
              color: '#fff',
            },
          },
        }}
      >
        <SettingsButtonComponent {...mockProps} />
      </MuiThemeProvider>
    )
    const computedStyle = window.getComputedStyle(
      wrapper
        .find(MoreVertIcon)
        .first()
        .getDOMNode()
    )
    expect(computedStyle).toHaveProperty('color', 'rgba(1, 0, 255, 0.44)')
  })

  it('uses the MUI theme h2 hover color for the settings button icon when the dropdown is open', () => {
    const defaultTheme = createMuiTheme()
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
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
                  color: 'rgb(67, 90, 120)',
                },
              },
            },
          },
        }}
      >
        <SettingsButtonComponent {...mockProps} />
      </MuiThemeProvider>
    )
    wrapper
      .find(IconButton)
      .first()
      .simulate('click')
    const computedStyle = window.getComputedStyle(
      wrapper
        .find(MoreVertIcon)
        .first()
        .getDOMNode()
    )
    expect(computedStyle).toHaveProperty('color', 'rgb(67, 90, 120)')
  })

  it('falls back to "inherit" color for the settings button icon if the MUI theme h2 hover color is not defined, when the dropdown is open', () => {
    const defaultTheme = createMuiTheme()
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
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
        <SettingsButtonComponent {...mockProps} />
      </MuiThemeProvider>
    )
    wrapper.find(IconButton).simulate('click')
    expect(
      wrapper
        .find(MoreVertIcon)
        .first()
        .prop('style')
    ).toHaveProperty('color', 'inherit')
  })
})
