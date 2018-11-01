/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

const getMockProps = () => ({
  result: {
    title: 'Some search result',
    linkURL: 'http://www.example.com',
    snippet: 'This is the search result description.'
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SearchTextResult page component', () => {
  it('renders without error', () => {
    const SearchTextResult = require('js/components/Search/SearchTextResult').default
    const mockProps = getMockProps()
    shallow(
      <SearchTextResult {...mockProps} />
    )
  })
})
