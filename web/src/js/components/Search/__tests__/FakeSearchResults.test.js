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
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    shallow(<SearchResults {...mockProps} />)
  })
})
