/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'

jest.mock('js/components/Dashboard/DashboardPopover')

const getMockProps = () => ({
  anchorElement: <div id="foo" />,
  open: false,
})

describe('MaxHeartsDropdownMessageComponent', () => {
  it('renders without error', () => {
    const MaxHeartsDropdownMessageComponent = require('js/components/Dashboard/MaxHeartsDropdownMessageComponent')
      .default
    const mockProps = getMockProps()
    shallow(<MaxHeartsDropdownMessageComponent {...mockProps} />).dive()
  })

  it('contains the expected message', () => {
    const MaxHeartsDropdownMessageComponent = require('js/components/Dashboard/MaxHeartsDropdownMessageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <MaxHeartsDropdownMessageComponent {...mockProps} />
    ).dive()
    expect(
      wrapper
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual(
      "You've earned the maximum Hearts from opening tabs today! You'll be able to earn more Hearts in a few hours."
    )
  })

  it('passes the "open" prop to DashboardPopover', () => {
    const MaxHeartsDropdownMessageComponent = require('js/components/Dashboard/MaxHeartsDropdownMessageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <MaxHeartsDropdownMessageComponent {...mockProps} />
    ).dive()
    wrapper.setProps({ open: true })
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(true)
    wrapper.setProps({ open: false })
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
  })

  it('passes the "anchorElement" prop to DashboardPopover', () => {
    const MaxHeartsDropdownMessageComponent = require('js/components/Dashboard/MaxHeartsDropdownMessageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <MaxHeartsDropdownMessageComponent {...mockProps} />
    ).dive()
    const mockAnchorEl = <div id="blah" />
    wrapper.setProps({ anchorElement: mockAnchorEl })
    expect(wrapper.find(DashboardPopover).prop('anchorEl')).toBe(mockAnchorEl)
  })
})
