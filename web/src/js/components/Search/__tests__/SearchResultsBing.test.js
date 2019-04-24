/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { showBingPagination } from 'js/utils/search-utils'

jest.mock('js/components/Search/SearchResultItem')
jest.mock('js/components/General/Link')
jest.mock('js/utils/search-utils')

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
  // Disable pagination until it's fully functional.
  showBingPagination.mockReturnValue(false)

  jest.clearAllMocks()
})

describe('SearchResultsBing', () => {
  it('renders without error', () => {
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    shallow(<SearchResultsBing {...mockProps} />)
  })

  it('calls the onPageChange prop when clicking to a new results page', () => {
    showBingPagination.mockReturnValue(true)
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    mockProps.page = 1
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    wrapper.find('[data-test-id="pagination-2"]').simulate('click')
    expect(mockProps.onPageChange).toHaveBeenCalledWith(2)
    wrapper.find('[data-test-id="pagination-7"]').simulate('click')
    expect(mockProps.onPageChange).toHaveBeenCalledWith(7)
  })

  it('calls the onPageChange prop when clicking the "next page" button', () => {
    showBingPagination.mockReturnValue(true)
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    mockProps.page = 3
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    wrapper.find('[data-test-id="pagination-next"]').simulate('click')
    expect(mockProps.onPageChange).toHaveBeenCalledWith(4)
  })

  it('calls the onPageChange prop when clicking the "previous page" button', () => {
    showBingPagination.mockReturnValue(true)
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    mockProps.page = 7
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    wrapper.find('[data-test-id="pagination-previous"]').simulate('click')
    expect(mockProps.onPageChange).toHaveBeenCalledWith(6)
  })
})
