/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'

const getMockProps = () => ({
  stat: 12,
  statText: 'friends recruited',
})

describe('StatComponent', () => {
  it('renders without error', () => {
    const StatComponent = require('js/components/Settings/Profile/StatComponent')
      .default
    const mockProps = getMockProps()
    shallow(<StatComponent {...mockProps} />).dive()
  })

  it('displays the "stat" value in the expected typography component', () => {
    const StatComponent = require('js/components/Settings/Profile/StatComponent')
      .default
    const mockProps = getMockProps()
    mockProps.stat = 142
    const wrapper = shallow(<StatComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(e => e.prop('variant') === 'h2')
        .render()
        .text()
    ).toEqual('142')
  })

  it('displays the "statText" value in the expected typography component', () => {
    const StatComponent = require('js/components/Settings/Profile/StatComponent')
      .default
    const mockProps = getMockProps()
    mockProps.statText = 'friends recruited'
    const wrapper = shallow(<StatComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(e => e.prop('variant') === 'body2')
        .render()
        .text()
    ).toEqual('friends recruited')
  })
})
