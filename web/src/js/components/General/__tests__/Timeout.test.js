/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  ms: 250,
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Timeout', function() {
  it('renders without error', () => {
    const Timeout = require('js/components/General/Timeout').default
    const mockProps = getMockProps()
    shallow(<Timeout {...mockProps}>{timedOut => <div>hi</div>}</Timeout>)
  })

  it('changes the children\'s "timedOut" argument to true when the time exceeds the provided timeout', () => {
    const Timeout = require('js/components/General/Timeout').default
    const mockProps = getMockProps()
    mockProps.ms = 412
    jest.useFakeTimers()
    const wrapper = shallow(
      <Timeout {...mockProps}>
        {timedOut =>
          timedOut ? (
            <div>yep, timed out</div>
          ) : (
            <div>nope, not yet timed out</div>
          )
        }
      </Timeout>
    )
    jest.advanceTimersByTime(411)
    expect(
      wrapper
        .find('div')
        .first()
        .text()
    ).toEqual('nope, not yet timed out')
    jest.advanceTimersByTime(2)
    expect(
      wrapper
        .find('div')
        .first()
        .text()
    ).toEqual('yep, timed out')
  })
})
