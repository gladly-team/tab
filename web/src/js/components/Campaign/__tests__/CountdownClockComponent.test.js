/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  campaignStartDatetime: moment(),
  campaignEndDatetime: moment(),
})

describe('Countdown clock', () => {
  it('renders without error', () => {
    const CountdownClock = require('js/components/Campaign/CountdownClockComponent')
      .default
    const mockProps = getMockProps()
    shallow(<CountdownClock {...mockProps} />)
  })
})
