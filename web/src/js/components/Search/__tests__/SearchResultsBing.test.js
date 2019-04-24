/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from 'js/components/General/Link'
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

describe('SearchResultsBing: tests for non-results display', () => {
  it('renders without error', () => {
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    shallow(<SearchResultsBing {...mockProps} />)
  })

  it('applies style to the root element', () => {
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.style = {
      background: '#FF0000',
    }
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    expect(
      wrapper
        .find('div')
        .first()
        .prop('style')
    ).toMatchObject({
      background: '#FF0000',
    })
  })

  it('shows "no results" when the search does not yield results', () => {
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'foo'
    mockProps.noSearchResults = true
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(
          n => n.render().text() === `No results found for ${mockProps.query}`
        ).length
    ).toBe(1)
  })

  it('sets a min-height to the results container when the query is still in progress', () => {
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'pizza'
    mockProps.isError = false
    mockProps.isEmptyQuery = false
    mockProps.noSearchResults = false
    mockProps.isQueryInProgress = true // waiting for a response
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    expect(wrapper.get(0).props.style.minHeight).toBe(1000)
  })

  it('removes the a min-height from the results container when the search is successful', () => {
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'pizza'
    mockProps.isError = false
    mockProps.isEmptyQuery = false
    mockProps.noSearchResults = false
    mockProps.isQueryInProgress = false
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    expect(wrapper.get(0).props.style.minHeight).toBe(0)
  })

  it('removes the a min-height from the results container when the query is empty', () => {
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = ''
    mockProps.isError = false
    mockProps.isEmptyQuery = true // empty query
    mockProps.noSearchResults = false
    mockProps.isQueryInProgress = false
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    expect(wrapper.get(0).props.style.minHeight).toBe(0)
  })

  it('removes the a min-height from the results container if there are no search results', () => {
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'this search will yield no results, sadly'
    mockProps.noSearchResults = true
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    expect(wrapper.get(0).props.style.minHeight).toBe(0)
  })

  it('removes the a min-height from the results container if there is an error when searching', () => {
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos please'
    mockProps.isError = true
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    expect(wrapper.get(0).props.style.minHeight).toBe(0)
  })

  it('shows an error message when there is some unexpected error', () => {
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'foo'
    mockProps.isError = true
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(
          n => n.render().text() === 'Unable to search at this time.'
        ).length
    ).toBe(1)
  })

  it('shows a button to search Google when there is an unexpected error', () => {
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    mockProps.isError = true
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    const errMsgContainer = wrapper.find('[data-test-id="search-err-msg"]')
    expect(
      errMsgContainer
        .find(Button)
        .first()
        .render()
        .text()
    ).toEqual('Search Google')
    expect(
      errMsgContainer
        .find(Link)
        .first()
        .prop('to')
    ).toEqual('https://www.google.com/search?q=ice%20cream')
  })

  it('shows a message if there is no search query', () => {
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = ''
    mockProps.isEmptyQuery = true
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .filterWhere(
          n =>
            n.render().text() ===
            'Search something to start raising money for charity!'
        )
        .exists()
    ).toBe(true)
  })
})

describe('SearchResultsBing: tests for pagination', () => {
  beforeEach(() => {
    showBingPagination.mockReturnValue(true)
  })

  it('shows the pagination container when it is enabled', () => {
    showBingPagination.mockReturnValue(true)
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    mockProps.page = 1
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    expect(
      wrapper.find('[data-test-id="pagination-container"]').prop('style')
        .display
    ).toEqual('block')
  })

  it('does not show the pagination container when it is not enabled', () => {
    showBingPagination.mockReturnValue(false)
    const SearchResultsBing = require('js/components/Search/SearchResultsBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    mockProps.page = 1
    const wrapper = shallow(<SearchResultsBing {...mockProps} />).dive()
    expect(
      wrapper.find('[data-test-id="pagination-container"]').prop('style')
        .display
    ).toEqual('none')
  })

  it('calls the onPageChange prop when clicking to a new results page', () => {
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
