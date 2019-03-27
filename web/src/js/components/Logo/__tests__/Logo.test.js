/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({})

describe('Logo component', () => {
  it('renders without error', () => {
    const Logo = require('js/components/Logo/Logo').default
    const mockProps = getMockProps()
    shallow(<Logo {...mockProps} />)
  })
})
