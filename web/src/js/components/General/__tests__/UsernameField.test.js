/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'

describe('UsernameField tests', function () {
  it('renders without error', function () {
    const UsernameField = require('js/components/General/UsernameField').default
    shallow(
      <UsernameField usernameDuplicate={false} otherError={false} />
    )
  })

  it('matches expected snapshot', function () {
    const UsernameField = require('js/components/General/UsernameField').default
    const wrapper = shallow(
      <UsernameField usernameDuplicate={false} otherError={false} />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
