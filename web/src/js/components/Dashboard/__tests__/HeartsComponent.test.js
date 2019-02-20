/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import HeartBorderIcon from '@material-ui/icons/FavoriteBorder'
import CheckmarkIcon from '@material-ui/icons/Done'
import HeartsDropdown from 'js/components/Dashboard/HeartsDropdownContainer'
import MaxHeartsDropdownMessageComponent from 'js/components/Dashboard/MaxHeartsDropdownMessageComponent'
import { mountWithHOC } from 'js/utils/test-utils'

jest.mock('js/components/Dashboard/HeartsDropdownContainer')
jest.mock('js/components/Dashboard/MaxHeartsDropdownMessageComponent')
jest.mock('js/constants', () => ({
  MAX_DAILY_HEARTS_FROM_TABS: 1000,
}))

const getMockProps = () => ({
  user: {
    tabsToday: 31,
    vcCurrent: 482,
  },
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

  it('is the expected color when not hovering', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<HeartsComponent {...mockProps} />)
    const typographyComputedStyle = window.getComputedStyle(
      wrapper.find(Typography).getDOMNode()
    )
    expect(typographyComputedStyle).toHaveProperty(
      'color',
      'rgba(0, 0, 0, 0.87)'
    )
  })

  it('is the expected color after clicking', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<HeartsComponent {...mockProps} />)

    // Simulate click on the hearts icon
    wrapper
      .find(HeartBorderIcon)
      .first()
      .simulate('click')

    const typographyComputedStyle = window.getComputedStyle(
      wrapper.find(Typography).getDOMNode()
    )
    expect(typographyComputedStyle).toHaveProperty('color', 'white')
  })

  it('is the expected color when hovering', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<HeartsComponent {...mockProps} />)

    // Simulate hover on the parent div
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseenter')
    const typographyComputedStyle = window.getComputedStyle(
      wrapper.find(Typography).getDOMNode()
    )
    expect(typographyComputedStyle).toHaveProperty('color', 'white')

    // Simulate ending hover
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseleave')
    const typographyComputedStyleNoHover = window.getComputedStyle(
      wrapper.find(Typography).getDOMNode()
    )
    expect(typographyComputedStyleNoHover).toHaveProperty(
      'color',
      'rgba(0, 0, 0, 0.87)'
    )
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
    mockProps.user.tabsToday = 999
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    expect(wrapper.find(CheckmarkIcon).exists()).toBe(false)
  })

  it('shows a checkmark in the heart if the user has maxed out daily hearts from tabs', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.tabsToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    expect(wrapper.find(CheckmarkIcon).exists()).toBe(true)
  })

  it('does not show the "max hearts from tabs" dropdown on hover if the user has not maxed out daily hearts from tabs', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.tabsToday = 999
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseenter')
    expect(wrapper.find(MaxHeartsDropdownMessageComponent).prop('open')).toBe(
      false
    )
  })

  it('shows the "max hearts from tabs" dropdown on hover if the user has maxed out daily hearts from tabs', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
    mockProps.user.tabsToday = 1000
    const wrapper = shallow(<HeartsComponent {...mockProps} />).dive()
    wrapper.find('[data-tour-id="hearts"]').simulate('mouseenter')
    expect(wrapper.find(MaxHeartsDropdownMessageComponent).prop('open')).toBe(
      true
    )
  })

  it('does not show the "max hearts from tabs" dropdown if the hearts dropdown is open', () => {
    const HeartsComponent = require('js/components/Dashboard/HeartsComponent')
      .default
    const mockProps = getMockProps()
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
})
