/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

describe('Footer', () => {
  it('renders without error', () => {
    const Footer = require('../Footer').default
    shallow(<Footer />)
  })

  it('matches expected snapshot', function() {
    const Footer = require('../Footer').default
    const wrapper = shallow(<Footer />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
