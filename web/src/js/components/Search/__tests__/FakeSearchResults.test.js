/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  query: 'tacos',
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SearchResults component', () => {
  it('renders without error', () => {
    const FakeSearchResults = require('js/components/Search/FakeSearchResults')
      .default
    const mockProps = getMockProps()
    shallow(<FakeSearchResults {...mockProps} />)
  })
})
