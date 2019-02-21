/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'
import Link from 'js/components/General/Link'
import { mountWithHOC } from 'js/utils/test-utils'
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

  it('is the expected color when not hovering', () => {
    const MoneyRaisedComponent = require('js/components/MoneyRaised/MoneyRaisedComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<MoneyRaisedComponent {...mockProps} />)
    const typographyComputedStyle = window.getComputedStyle(
      wrapper
        .find(Typography)
        .first()
        .getDOMNode()
    )
    expect(typographyComputedStyle).toHaveProperty(
      'color',
      'rgba(255, 255, 255, 0.8)'
    )
  })

  it('is the expected color when hovering', () => {
    const MoneyRaisedComponent = require('js/components/MoneyRaised/MoneyRaisedComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<MoneyRaisedComponent {...mockProps} />)

    // Simulate hover on the parent div
    wrapper.find('[data-test-id="money-raised-button"]').simulate('mouseenter')
    const typographyComputedStyle = window.getComputedStyle(
      wrapper
        .find(Typography)
        .first()
        .getDOMNode()
    )
    expect(typographyComputedStyle).toHaveProperty('color', 'white')

    // Simulate ending hover
    wrapper.find('[data-test-id="money-raised-button"]').simulate('mouseleave')
    const typographyComputedStyleNoHover = window.getComputedStyle(
      wrapper
        .find(Typography)
        .first()
        .getDOMNode()
    )
    expect(typographyComputedStyleNoHover).toHaveProperty(
      'color',
      'rgba(255, 255, 255, 0.8)'
    )
  })

  it('is the expected color after clicking', () => {
    const MoneyRaisedComponent = require('js/components/MoneyRaised/MoneyRaisedComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<MoneyRaisedComponent {...mockProps} />)
    wrapper.find('[data-test-id="money-raised-button"]').simulate('click')
    const typographyComputedStyle = window.getComputedStyle(
      wrapper
        .find(Typography)
        .first()
        .getDOMNode()
    )
    expect(typographyComputedStyle).toHaveProperty('color', 'white')
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
