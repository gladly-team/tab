/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

describe('UsernameField tests', function () {
  it('renders without error', function () {
    const UsernameField = require('../UsernameField').default
    shallow(
      <UsernameField usernameDuplicate={false} otherError={false} />
    )
  })

  it('matches expected snapshot', function () {
    const UsernameField = require('../UsernameField').default
    const wrapper = shallow(
      <UsernameField usernameDuplicate={false} otherError={false} />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
