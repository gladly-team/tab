/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { getMockBingComputationResult } from 'js/utils/test-utils-search'
import Typography from '@material-ui/core/Typography'
import CalculatorIcon from 'mdi-material-ui/Calculator'

jest.mock('mdi-material-ui/Calculator')

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

  it('displays the "expression" value in the expected Typography component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const ComputationSearchResult = require('js/components/Search/ComputationSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.expression = '24 * 365'
    const wrapper = shallow(<ComputationSearchResult {...mockProps} />).dive()
    const elem = wrapper
      .find('[data-test-id="search-result-computation-expression"]')
      .first()
    expect(elem.type()).toEqual(Typography)
    expect(elem.prop('variant')).toEqual('body2')
    expect(elem.render().text()).toEqual('24 * 365 =')
  })

  it('displays the result value in the expected Typography component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const ComputationSearchResult = require('js/components/Search/ComputationSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.value = '323 liters of maple syrup'
    const wrapper = shallow(<ComputationSearchResult {...mockProps} />).dive()
    const elem = wrapper
      .find('[data-test-id="search-result-computation-value"]')
      .first()
    expect(elem.type()).toEqual(Typography)
    expect(elem.prop('variant')).toEqual('h4')
    expect(elem.render().text()).toEqual('323 liters of maple syrup')
  })

  it('displays a calculator icon', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const ComputationSearchResult = require('js/components/Search/ComputationSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.value = '323 liters of maple syrup'
    const wrapper = shallow(<ComputationSearchResult {...mockProps} />).dive()
    expect(wrapper.find(CalculatorIcon).exists()).toBe(true)
  })
})
