/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import MockDate from 'mockdate'
import moment from 'moment'

const mockNow = '2018-05-15T14:31:43.130'

beforeAll(() => {
  MockDate.set(moment(mockNow))
})

afterAll(() => {
  MockDate.reset()
})

const mockProps = {
  user: {
    id: 'abc123'
  },
  widget: {
    id: 'widget-xyz',
    name: 'Clock',
    enabled: true,
    config: JSON.stringify({
      format24: false
    }),
    settings: JSON.stringify([
      {
        'field': 'format24',
        'type': 'boolean',
        'display': 'Use 24 hours format',
        'defaultValue': false
      }
    ]),
    type: 'clock'
  }
}

describe('Clock widget  component', () => {
  it('renders without error', () => {
    const ClockWidgetComponent = require('../ClockWidgetComponent').default
    shallow(
      <ClockWidgetComponent {...mockProps} />
    )
  })

  it('shows the correct time', () => {
    const ClockWidgetComponent = require('../ClockWidgetComponent').default
    const mockNow = '2018-05-15T14:31:43.130'
    MockDate.set(moment(mockNow))
    const wrapper = shallow(
      <ClockWidgetComponent {...mockProps} />
    )
    expect(wrapper.find('[data-test-id="clock-widget-time"]').text()).toEqual('2:31')
  })

  it('shows the correct date', () => {
    const ClockWidgetComponent = require('../ClockWidgetComponent').default
    const mockNow = '2018-05-15T14:31:43.130'
    MockDate.set(moment(mockNow))
    const wrapper = shallow(
      <ClockWidgetComponent {...mockProps} />
    )
    expect(wrapper.find('[data-test-id="clock-widget-date"]').text()).toEqual('Tuesday, May 15')
  })

  it('shows the correct time in 24h format in the morning', () => {
    const ClockWidgetComponent = require('../ClockWidgetComponent').default
    const props = Object.assign({}, mockProps)
    props.widget.config = JSON.stringify({
      format24: true
    })
    const mockNow = '2018-05-15T08:58:22.130'
    MockDate.set(moment(mockNow))
    const wrapper = shallow(
      <ClockWidgetComponent {...mockProps} />
    )
    expect(wrapper.find('[data-test-id="clock-widget-time"]').text()).toEqual('8:58')
  })

  it('shows the correct time in 24h format in the afternoon', () => {
    const ClockWidgetComponent = require('../ClockWidgetComponent').default
    const props = Object.assign({}, mockProps)
    props.widget.config = JSON.stringify({
      format24: true
    })
    const mockNow = '2018-05-15T14:31:43.130'
    MockDate.set(moment(mockNow))
    const wrapper = shallow(
      <ClockWidgetComponent {...mockProps} />
    )
    expect(wrapper.find('[data-test-id="clock-widget-time"]').text()).toEqual('14:31')
  })

  it('midnight is correct in 24h format', () => {
    const ClockWidgetComponent = require('../ClockWidgetComponent').default
    const props = Object.assign({}, mockProps)
    props.widget.config = JSON.stringify({
      format24: true
    })
    const mockNow = '2018-05-15T00:16:02.130'
    MockDate.set(moment(mockNow))
    const wrapper = shallow(
      <ClockWidgetComponent {...mockProps} />
    )
    expect(wrapper.find('[data-test-id="clock-widget-time"]').text()).toEqual('00:16')
  })
})
