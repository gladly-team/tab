/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

// TODO: add tests

const getMockProps = () => ({
  item: {
    deepLinks: [],
    displayUrl: 'https://example.com/thing/',
    id: 'some-id-1',
    name: 'The Title',
    snippet:
      '<b>Lorem ipsum</b> dolor sit amet, consectetur adipiscing elit. Etiam sit amet libero dapibus, pellentesque tellus convallis, cursus urna. Donec erat.',
    url: 'https://example.com/another-thing/',
  },
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('WebPageSearchResult', () => {
  it('renders without error', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    shallow(<WebPageSearchResult {...mockProps} />)
  })
})
