/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { getMockBingComputationResult } from 'js/utils/test-utils-search'

const getMockProps = () => ({
  item: getMockBingComputationResult(),
})

describe('ComputationSearchResult', () => {
  it('renders without error', () => {
    const ComputationSearchResult = require('js/components/Search/ComputationSearchResult')
      .default
    const mockProps = getMockProps()
    shallow(<ComputationSearchResult {...mockProps} />).dive()
  })

  it('returns null if the "expression" value is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const ComputationSearchResult = require('js/components/Search/ComputationSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.expression
    const wrapper = shallow(<ComputationSearchResult {...mockProps} />).dive()
    expect(wrapper.html()).toBeNull()
  })

  it('returns null if the "value" value is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const ComputationSearchResult = require('js/components/Search/ComputationSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.value
    const wrapper = shallow(<ComputationSearchResult {...mockProps} />).dive()
    expect(wrapper.html()).toBeNull()
  })
})
