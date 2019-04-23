/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { getMockSuccessfulSearchQuery } from 'js/utils/test-utils-search'
import fetchBingSearchResults from 'js/components/Search/fetchBingSearchResults'

jest.mock('js/components/Search/fetchBingSearchResults')
jest.mock('js/components/Search/SearchResultsBing')
jest.mock('js/authentication/user')
jest.mock('js/mutations/LogSearchMutation')

// TODO: add tests

const getMockProps = () => ({
  query: null,
  page: null,
  onPageChange: jest.fn(),
  searchSource: null,
})

beforeEach(() => {
  jest.clearAllMocks()
  fetchBingSearchResults.mockResolvedValue(getMockSuccessfulSearchQuery())
})

describe('SearchResultsQueryBing', () => {
  it('renders without error', () => {
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    shallow(<SearchResultsQueryBing {...mockProps} />)
  })
})
