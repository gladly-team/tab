/* eslint-env jest */

import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  campaignStartDatetime: moment('2019-10-21T16:00:00.000Z'),
  campaignEndDatetime: moment('2019-11-10T11:30:00.000Z'),
})

const mockNow = '2019-11-05T10:00:00.000Z'

beforeAll(() => {
  jest.useFakeTimers()
})

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  MockDate.reset()
})

describe('Countdown clock', () => {
  it('renders without error', () => {
    const CountdownClock = require('js/components/Campaign/CountdownClockComponent')
      .default
    const mockProps = getMockProps()
    shallow(<CountdownClock {...mockProps} />)
  })

  it('displays the expected countdown text', () => {
    const CountdownClock = require('js/components/Campaign/CountdownClockComponent')
      .default
    const wrapper = shallow(
      <CountdownClock
        campaignStartDatetime={moment('2019-10-21T16:00:00.000Z')}
        campaignEndDatetime={moment('2019-11-10T11:30:04.000Z')}
      />
    )
    expect(wrapper.at(0).text()).toEqual('5d 1h 30m 4s')
  })

  it('displays the expected countdown text when the end is months in the future', () => {
    const CountdownClock = require('js/components/Campaign/CountdownClockComponent')
      .default
    const wrapper = shallow(
      <CountdownClock
        campaignStartDatetime={moment('2019-10-21T16:00:00.000Z')}
        campaignEndDatetime={moment('2020-01-20T11:31:42.000Z')}
      />
    )
    expect(wrapper.at(0).text()).toEqual('76d 1h 31m 42s')
  })
})
