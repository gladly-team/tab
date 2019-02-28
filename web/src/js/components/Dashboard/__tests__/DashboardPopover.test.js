/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Popover from '@material-ui/core/Popover'

const getMockProps = () => ({
  anchorEl: <div>hi</div>,
  open: false,
  onClose: () => {},
})

describe('DashboardPopover', () => {
  it('renders without error', () => {
    const DashboardPopover = require('js/components/Dashboard/DashboardPopover')
      .default
    const mockProps = getMockProps()
    shallow(<DashboardPopover {...mockProps} />).dive()
  })

  it('passes the "open" prop to Popover', () => {
    const DashboardPopover = require('js/components/Dashboard/DashboardPopover')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<DashboardPopover {...mockProps} />).dive()
    wrapper.setProps({ open: true })
    expect(wrapper.find(Popover).prop('open')).toBe(true)
    wrapper.setProps({ open: false })
    expect(wrapper.find(Popover).prop('open')).toBe(false)
  })

  it('passes the "anchorElement" prop to Popover', () => {
    const DashboardPopover = require('js/components/Dashboard/DashboardPopover')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<DashboardPopover {...mockProps} />).dive()
    const mockAnchorEl = <div id="blah" />
    wrapper.setProps({ anchorEl: mockAnchorEl })
    expect(wrapper.find(Popover).prop('anchorEl')).toBe(mockAnchorEl)
  })

  it('passes extra props to Popover', () => {
    const DashboardPopover = require('js/components/Dashboard/DashboardPopover')
      .default
    const mockProps = getMockProps()
    mockProps.foo = 'blah'
    const wrapper = shallow(<DashboardPopover {...mockProps} />).dive()
    expect(wrapper.find(Popover).prop('foo')).toEqual('blah')
  })
})
