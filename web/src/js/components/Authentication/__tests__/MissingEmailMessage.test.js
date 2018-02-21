/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'

describe('MissingEmailMessage tests', function () {
  it('renders without error', function () {
    const MissingEmailMessage = require('../MissingEmailMessage').default
    shallow(
      <MissingEmailMessage />
    )
  })

  it('matches expected snapshot', function () {
    const MissingEmailMessage = require('../MissingEmailMessage').default
    const wrapper = shallow(
      <MissingEmailMessage />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
