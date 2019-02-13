/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'

jest.mock('react-relay')
jest.mock('js/components/General/withUserId')

const getMockProps = () => ({
  app: {
    moneyRaised: 610234.56,
    dollarsPerDayRate: 500.0,
  },
  user: null,
})

afterEach(() => {
  jest.resetModules()
})

describe('SearchMenuComponent', () => {
  it('renders without error', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SearchMenuComponent {...mockProps} />)
  })

  it('assigns styles to the root elemnt', () => {
    const SearchMenuComponent = require('js/components/Search/SearchMenuComponent')
      .default
    const mockProps = getMockProps()
    mockProps.style = {
      display: 'inline',
      color: 'green',
    }
    const wrapper = mount(<SearchMenuComponent {...mockProps} />)
    const elem = wrapper.getDOMNode()
    const elemStyle = window.getComputedStyle(elem)
    expect(elemStyle.display).toBe('inline')
    expect(elemStyle.color).toBe('green')
  })
})
