/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const MockProps = () => {
  return {
    user: {},
    app: {},
    isUserAnonymous: false,
  }
}

describe('User menu component', () => {
  it('renders without error', () => {
    const mockProps = MockProps()
    const UserMenuComponent = require('js/components/Dashboard/UserMenuComponent')
      .default
    shallow(<UserMenuComponent {...mockProps} />).dive()
  })
})
