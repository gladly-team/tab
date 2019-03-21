/* eslint-env jest */

import React from 'react'
import { get } from 'lodash/object'
import { mount, shallow } from 'enzyme'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import HeartBorderIcon from '@material-ui/icons/FavoriteBorder'
import CheckmarkIcon from '@material-ui/icons/Done'
import HeartsDropdown from 'js/components/Dashboard/HeartsDropdownContainer'
import MaxHeartsDropdownMessageComponent from 'js/components/Dashboard/MaxHeartsDropdownMessageComponent'
import { mountWithHOC } from 'js/utils/test-utils'

jest.mock('js/components/Dashboard/HeartsDropdownContainer')
jest.mock('js/components/Dashboard/MaxHeartsDropdownMessageComponent')
jest.mock('js/constants', () => ({
  MAX_DAILY_HEARTS_FROM_SEARCHES: 1000,
  MAX_DAILY_HEARTS_FROM_TABS: 1000,
}))

const getMockProps = () => ({
  user: {
    searchesToday: 0,
    tabsToday: 31,
    vcCurrent: 482,
  },
  showMaxHeartsFromSearchesMessage: false,
  showMaxHeartsFromTabsMessage: false,
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('HeartsComponent', () => {
  it('renders without error', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    shallow(<HeartsComponent {...mockProps} />).dive()
  })

  it('contains an ID for the new user tour (to showcase hearts)', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()

    // Important: other code relies on the data-tour-id to show the
    // new user tour. Do not change it without updating it elsewhere.
    expect(wrapper.find('[data-tour-id="hearts"]').length).toBe(1)
  })

  it('shows the comma-formatted heart count', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.vcCurrent = 15422
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('15,422')
  })

  it('opens the dropdown on click', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<HeartsComponent {...mockProps} />)

    expect(wrapper.find(HeartsDropdown).prop('open')).toBe(false)
    wrapper
      .find(Typography)
      .first()
      .simulate('click')
    expect(wrapper.find(HeartsDropdown).prop('open')).toBe(true)
  })

  it('does not show a checkmark in the heart if the user has not maxed out daily hearts from tabs', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromTabsMessage = true
    mockProps.user.tabsToday = 999
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    expect(wrapper.find(CheckmarkIcon).exists()).toBe(false)
  })

  it('shows a checkmark in the heart if the user has maxed out daily hearts from tabs', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromTabsMessage = true
    mockProps.user.tabsToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    expect(wrapper.find(CheckmarkIcon).exists()).toBe(true)
  })

  it('does not show a checkmark in the heart if "showMaxHeartsFromTabsMessage" is false, even when the user has maxed out daily hearts from tabs', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromTabsMessage = false
    mockProps.user.tabsToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    expect(wrapper.find(CheckmarkIcon).exists()).toBe(false)
  })

  it('does not show a checkmark in the heart if the user has not maxed out daily hearts from searches', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromSearchesMessage = true
    mockProps.user.searchesToday = 999
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    expect(wrapper.find(CheckmarkIcon).exists()).toBe(false)
  })

  it('shows a checkmark in the heart if the user has maxed out daily hearts from searches', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromSearchesMessage = true
    mockProps.user.searchesToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    expect(wrapper.find(CheckmarkIcon).exists()).toBe(true)
  })

  it('does not show a checkmark in the heart if "showMaxHeartsFromTabsMessage" is false, even when the user has maxed out daily hearts from searches', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromSearchesMessage = false
    mockProps.user.searchesToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    expect(wrapper.find(CheckmarkIcon).exists()).toBe(false)
  })

  it('does not show the "max hearts" dropdown on hover if the user has not maxed out daily hearts from tabs', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromTabsMessage = true
    mockProps.user.tabsToday = 999
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseenter')
    expect(wrapper.find(MaxHeartsDropdownMessageComponent).prop('open')).toBe(
      false
    )
  })

  it('shows the "max hearts" dropdown on hover if the user has maxed out daily hearts from tabs', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromTabsMessage = true
    mockProps.user.tabsToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseenter')
    expect(wrapper.find(MaxHeartsDropdownMessageComponent).prop('open')).toBe(
      true
    )
  })

  it('does not show the "max hearts" dropdown on hover if "showMaxHeartsFromTabsMessage" is false, even when the user has maxed out daily hearts from tabs', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromTabsMessage = false
    mockProps.user.tabsToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseenter')
    expect(wrapper.find(MaxHeartsDropdownMessageComponent).prop('open')).toBe(
      false
    )
  })

  it('does not show the "max hearts" dropdown on hover if the user has not maxed out daily hearts from searches', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromSearchesMessage = true
    mockProps.user.searchesToday = 999
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseenter')
    expect(wrapper.find(MaxHeartsDropdownMessageComponent).prop('open')).toBe(
      false
    )
  })

  it('shows the "max hearts" dropdown on hover if the user has maxed out daily hearts from searches', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromSearchesMessage = true
    mockProps.user.searchesToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseenter')
    expect(wrapper.find(MaxHeartsDropdownMessageComponent).prop('open')).toBe(
      true
    )
  })

  it('does not show the "max hearts" dropdown on hover if "showMaxHeartsFromSearchesMessage" is false, even when the user has maxed out daily hearts from searches', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromSearchesMessage = false
    mockProps.user.searchesToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseenter')
    expect(wrapper.find(MaxHeartsDropdownMessageComponent).prop('open')).toBe(
      false
    )
  })

  it('does not show the "max hearts" dropdown if the hearts dropdown is open', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromTabsMessage = true
    mockProps.user.tabsToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseenter')
    expect(wrapper.find(MaxHeartsDropdownMessageComponent).prop('open')).toBe(
      true
    )
    wrapper.find('[data-tour-id="hearts"]').simulate('click')
    expect(wrapper.find(MaxHeartsDropdownMessageComponent).prop('open')).toBe(
      false
    )
    expect(wrapper.find(HeartsDropdown).prop('open')).toBe(true)
  })

  it('shows the expected "max hearts" message if the user has maxed out daily hearts from tabs', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromTabsMessage = true
    mockProps.user.tabsToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseenter')
    expect(
      wrapper.find(MaxHeartsDropdownMessageComponent).prop('message')
    ).toBe(
      `You've earned the maximum Hearts from opening tabs today! You'll be able to earn more Hearts in a while.`
    )
  })

  it('shows the expected "max hearts" message if the user has maxed out daily hearts from searches', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromSearchesMessage = true
    mockProps.user.searchesToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseenter')
    expect(
      wrapper.find(MaxHeartsDropdownMessageComponent).prop('message')
    ).toBe(
      `You've earned the maximum Hearts from searching today! You'll be able to earn more Hearts in a while.`
    )
  })

  it('shows the expected "max hearts" message if the user has maxed out daily hearts from tabs AND searches', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromTabsMessage = true
    mockProps.user.tabsToday = 1000
    mockProps.showMaxHeartsFromSearchesMessage = true
    mockProps.user.searchesToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseenter')
    expect(
      wrapper.find(MaxHeartsDropdownMessageComponent).prop('message')
    ).toBe(
      `You've earned the maximum Hearts for now. You'll be able to earn more Hearts in a while.`
    )
  })

  it('uses the MUI h2 Typography variant for the main text (this is important because our nested theme styles the h2 variant)', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .first()
        .prop('variant')
    ).toEqual('h2')
  })

  it('uses the MUI theme h2 hover color for the main text when the dropdown is open', () => {
    const defaultTheme = createMuiTheme()
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromTabsMessage = true
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
        <HeartsComponent {...mockProps} />
      </MuiThemeProvider>
    )
    wrapper.find(Typography).simulate('click')
    const typographyComputedStyle = window.getComputedStyle(
      wrapper
        .find(Typography)
        .first()
        .getDOMNode()
    )
    expect(typographyComputedStyle).toHaveProperty('color', 'rgb(200, 100, 40)')
  })

  it('falls back to "inherit" color for the main text if the MUI theme h2 hover color is not defined, when the dropdown is open', () => {
    const defaultTheme = createMuiTheme()
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
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
        <HeartsComponent {...mockProps} />
      </MuiThemeProvider>
    )
    wrapper.find(Typography).simulate('click')
    expect(
      wrapper
        .find(Typography)
        .first()
        .prop('style')
    ).toHaveProperty('color', 'inherit')
  })

  it('uses the MUI theme h2 color for the Hearts icon', () => {
    const defaultTheme = createMuiTheme()
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
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
        <HeartsComponent {...mockProps} />
      </MuiThemeProvider>
    )
    const computedStyle = window.getComputedStyle(
      wrapper
        .find(HeartBorderIcon)
        .first()
        .getDOMNode()
    )
    expect(computedStyle).toHaveProperty('color', 'rgba(1, 0, 255, 0.44)')
  })

  it('uses the MUI theme h2 hover color for the Hearts icon when the dropdown is open', () => {
    const defaultTheme = createMuiTheme()
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
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
        <HeartsComponent {...mockProps} />
      </MuiThemeProvider>
    )
    wrapper.find(Typography).simulate('click')
    const computedStyle = window.getComputedStyle(
      wrapper
        .find(HeartBorderIcon)
        .first()
        .getDOMNode()
    )
    expect(computedStyle).toHaveProperty('color', 'rgb(67, 90, 120)')
  })

  it('falls back to "inherit" color for the Hearts icon if the MUI theme h2 hover color is not defined, when the dropdown is open', () => {
    const defaultTheme = createMuiTheme()
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
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
        <HeartsComponent {...mockProps} />
      </MuiThemeProvider>
    )
    wrapper.find(Typography).simulate('click')
    expect(
      wrapper
        .find(HeartBorderIcon)
        .first()
        .prop('style')
    ).toHaveProperty('color', 'inherit')
  })

  it('uses the MUI theme h2 color for the Checkmark icon', () => {
    const defaultTheme = createMuiTheme()
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromTabsMessage = true
    mockProps.user.tabsToday = 1001
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
        <HeartsComponent {...mockProps} />
      </MuiThemeProvider>
    )
    const computedStyle = window.getComputedStyle(
      wrapper
        .find(CheckmarkIcon)
        .first()
        .getDOMNode()
    )
    expect(computedStyle).toHaveProperty('color', 'rgba(1, 0, 255, 0.44)')
  })

  it('uses the MUI theme h2 hover color for the Checkmark icon when the dropdown is open', () => {
    const defaultTheme = createMuiTheme()
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromTabsMessage = true
    mockProps.user.tabsToday = 1001
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
        <HeartsComponent {...mockProps} />
      </MuiThemeProvider>
    )
    wrapper.find(Typography).simulate('click')
    const computedStyle = window.getComputedStyle(
      wrapper
        .find(CheckmarkIcon)
        .first()
        .getDOMNode()
    )
    expect(computedStyle).toHaveProperty('color', 'rgb(67, 90, 120)')
  })

  it('falls back to "inherit" color for the Checkmark icon if the MUI theme h2 hover color is not defined, when the dropdown is open', () => {
    const defaultTheme = createMuiTheme()
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.showMaxHeartsFromTabsMessage = true
    mockProps.user.tabsToday = 1001
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
        <HeartsComponent {...mockProps} />
      </MuiThemeProvider>
    )
    wrapper.find(Typography).simulate('click')
    expect(
      wrapper
        .find(CheckmarkIcon)
        .first()
        .prop('style')
    ).toHaveProperty('color', 'inherit')
  })

  it('sets a marginTop on the HeartsDropdown component', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    expect(wrapper.find(HeartsDropdown).prop('style')).toHaveProperty(
      'marginTop',
      6
    )
  })
})
