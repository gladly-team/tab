/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

jest.mock('js/components/Search/SearchResultItem')
jest.mock('js/components/General/Link')

// TODO: add tests

const getMockProps = () => ({
  classes: {},
  data: {
    pole: [],
    mainline: [
      {
        type: 'WebPages',
        key: 'some-key-1',
        value: {
          data: 'here',
        },
      },
      {
        type: 'WebPages',
        key: 'some-key-2',
        value: {
          data: 'here',
        },
      },
    ],
    sidebar: [
      {
        type: 'WebPages',
        key: 'some-key-1',
        value: {
          data: 'here',
        },
      },
      {
        type: 'WebPages',
        key: 'some-key-2',
        value: {
          data: 'here',
        },
      },
    ],
  },
  isEmptyQuery: false,
  isError: false,
  isQueryInProgress: false,
  noSearchResults: false,
  onPageChange: jest.fn(),
  page: 1,
  query: 'healthy salad recipes, not tacos',
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('SearchResultsBing', () => {
  it('renders without error', () => {
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    shallow(<SearchResultsBing {...mockProps} />)
  })
})
