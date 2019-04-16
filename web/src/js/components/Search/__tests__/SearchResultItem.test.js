/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

jest.mock('js/components/Search/NewsSearchResults')
jest.mock('js/components/Search/WebPageSearchResult')

// TODO: add tests

const getMockProps = () => ({
  type: 'WebPages',
  itemData: {
    some: 'data',
  },
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('SearchResultItem', () => {
  it('renders without error', () => {
    const SearchResultItem = require('js/components/Search/SearchResultItem')
      .default
    const mockProps = getMockProps()
    shallow(<SearchResultItem {...mockProps} />)
  })
})
