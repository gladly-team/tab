/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  isUserAnonymous: false,
})

describe('SettingsButtonComponent', () => {
  it('renders without error', () => {
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SettingsButtonComponent {...mockProps} />).dive()
  })
})
