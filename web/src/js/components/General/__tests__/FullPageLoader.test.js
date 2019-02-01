/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import Logo from 'js/components/Logo/Logo'
import Typography from '@material-ui/core/Typography'

jest.mock('js/components/Logo/Logo')

const getMockProps = () => ({
  delay: 250,
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('FullPageLoader', function() {
  it('renders without error', () => {
    const FullPageLoader = require('js/components/General/FullPageLoader')
      .default
    const mockProps = getMockProps()
    shallow(<FullPageLoader {...mockProps} />)
  })

  it('contains the logo', () => {
    const FullPageLoader = require('js/components/General/FullPageLoader')
      .default
    jest.useFakeTimers()
    const mockProps = getMockProps()
    const wrapper = mount(<FullPageLoader {...mockProps} />)
    jest.runAllTimers()
    wrapper.update()
    expect(wrapper.find(Logo).length).toBe(1)
  })

  it('says "Loading"', () => {
    const FullPageLoader = require('js/components/General/FullPageLoader')
      .default
    jest.useFakeTimers()
    const mockProps = getMockProps()
    const wrapper = mount(<FullPageLoader {...mockProps} />)
    jest.runAllTimers()
    wrapper.update()
    expect(
      wrapper
        .find(Typography)
        .first()
        .children()
        .text()
    ).toEqual('Loading...')
  })

  it('returns null until after the timeout', () => {
    const FullPageLoader = require('js/components/General/FullPageLoader')
      .default
    jest.useFakeTimers()
    const mockProps = getMockProps()
    mockProps.delay = 302
    const wrapper = mount(<FullPageLoader {...mockProps} />)
    jest.advanceTimersByTime(301)
    wrapper.update()
    expect(wrapper.find('div').length).toBe(0)
    jest.advanceTimersByTime(2)
    wrapper.update()
    expect(wrapper.find('div').length).toBe(1)
  })
})
