/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { getMockSuccessfulSearchQuery } from 'js/utils/test-utils-search'
import fetchBingSearchResults from 'js/components/Search/fetchBingSearchResults'
import { flushAllPromises } from 'js/utils/test-utils'
import SearchResultsBing from 'js/components/Search/SearchResultsBing'

jest.mock('js/components/Search/fetchBingSearchResults')
jest.mock('js/components/Search/SearchResultsBing')
jest.mock('js/authentication/user')
jest.mock('js/mutations/LogSearchMutation')
jest.mock('js/utils/logger')

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

  it('passes isEmptyQuery=false to SearchResultsBing when the query exists', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(wrapper.find(SearchResultsBing).prop('isEmptyQuery')).toBe(false)
  })

  it('passes isEmptyQuery=true to SearchResultsBing when the query exists', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = null
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(wrapper.find(SearchResultsBing).prop('isEmptyQuery')).toBe(true)
  })

  it('passes isError=false to SearchResultsBing when the query succeeds', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(wrapper.find(SearchResultsBing).prop('isError')).toBe(false)
  })

  it('passes isError=true to SearchResultsBing when the query request throws', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    fetchBingSearchResults.mockImplementation(() => {
      throw new Error('Search did not work.')
    })
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(wrapper.find(SearchResultsBing).prop('isError')).toBe(true)
  })

  it('passes isQueryInProgress=true to SearchResultsBing when the query is pending', async () => {
    expect.assertions(2)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'

    // Mock that therequest takes some time.
    jest.useFakeTimers()
    fetchBingSearchResults.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(getMockSuccessfulSearchQuery())
        }, 8e3)
      })
    })

    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(wrapper.find(SearchResultsBing).prop('isQueryInProgress')).toBe(true)

    // Mock that the request returns.
    jest.advanceTimersByTime(10e3)
    await flushAllPromises()

    expect(wrapper.find(SearchResultsBing).prop('isQueryInProgress')).toBe(
      false
    )
  })

  it('passes the page number to SearchResultsBing', async () => {
    expect.assertions(2)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    mockProps.page = 124
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(wrapper.find(SearchResultsBing).prop('page')).toEqual(124)
    wrapper.setProps({ page: 2 })
    expect(wrapper.find(SearchResultsBing).prop('page')).toEqual(2)
  })
})
