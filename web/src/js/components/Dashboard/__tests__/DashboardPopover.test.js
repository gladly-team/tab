/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

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
})
