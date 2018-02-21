/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'

describe('VerifyEmailMessage tests', function () {
  it('renders without error', function () {
    const VerifyEmailMessage = require('../VerifyEmailMessage').default
    shallow(
      <VerifyEmailMessage />
    )
  })

  it('matches expected snapshot', function () {
    const VerifyEmailMessage = require('../VerifyEmailMessage').default
    const wrapper = shallow(
      <VerifyEmailMessage />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
