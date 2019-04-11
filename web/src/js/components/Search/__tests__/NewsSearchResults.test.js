/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

// TODO: add tests

const getMockProps = () => ({
  newsItems: [
    {
      some: 'data',
      url: 'https://example.com/foo/',
    },
    {
      some: 'other-data',
      url: 'https://example.com/thing/',
    },
  ],
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('NewsSearchResults', () => {
  it('renders without error', () => {
    const NewsSearchResults = require('js/components/Search/NewsSearchResults')
      .default
    const mockProps = getMockProps()
    shallow(<NewsSearchResults {...mockProps} />)
  })
})
