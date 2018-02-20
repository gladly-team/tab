/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'

const mockUserData = {
  id: 'abc-123'
}

describe('EnterUsernameForm tests', function () {
  it('renders without error', function () {
    const EnterUsernameForm = require('../EnterUsernameForm').default
    shallow(
      <EnterUsernameForm user={mockUserData} />
    )
  })

  it('matches expected snapshot', function () {
    const EnterUsernameForm = require('../EnterUsernameForm').default
    const wrapper = shallow(
      <EnterUsernameForm user={mockUserData} />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
