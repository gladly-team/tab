/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  condition: true,
  wrapper: jest.fn(),
  children: <p>test</p>,
})

describe('ConditionalWrapper', () => {
  it('renders without error', () => {
    const ConditionalWrapper = require('../ConditionalWrapper').default
    shallow(<ConditionalWrapper {...getMockProps()} />)
  })

  it('calls wrapper(children) if condition is true', () => {
    const ConditionalWrapper = require('../ConditionalWrapper').default
    const mockProps = getMockProps()
    shallow(<ConditionalWrapper {...mockProps} />)
    expect(mockProps.wrapper).toHaveBeenCalledWith(mockProps.children)
  })

  it("doesn't call wrapper() if condition is false", () => {
    const ConditionalWrapper = require('../ConditionalWrapper').default
    const mockProps = getMockProps()
    shallow(<ConditionalWrapper {...mockProps} condition={false} />)
    expect(mockProps.wrapper).toHaveBeenCalledTimes(0)
  })
})
