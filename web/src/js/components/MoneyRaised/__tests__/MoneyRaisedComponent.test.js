/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import { mountWithHOC } from 'js/utils/test-utils'

jest.mock('js/navigation/navigation')
jest.mock('js/components/General/Link')

const getMockProps = () => ({
  app: {
    moneyRaised: 650200,
    dollarsPerDayRate: 450,
  },
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
})
