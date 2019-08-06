/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  usernameDuplicate: false,
  otherError: false,
})

describe('UsernameField tests', function() {
  it('renders without error', function() {
    const UsernameField = require('js/components/General/UsernameField').default
    const mockProps = getMockProps()
    shallow(<UsernameField {...mockProps} />)
  })
})
