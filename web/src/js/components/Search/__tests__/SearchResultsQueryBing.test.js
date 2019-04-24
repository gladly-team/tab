/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { getMockSuccessfulSearchQuery } from 'js/utils/test-utils-search'
import fetchBingSearchResults from 'js/components/Search/fetchBingSearchResults'
import { flushAllPromises } from 'js/utils/test-utils'
import SearchResultsBing from 'js/components/Search/SearchResultsBing'
import logger from 'js/utils/logger'

jest.mock('js/components/Search/fetchBingSearchResults')
jest.mock('js/components/Search/SearchResultsBing')
jest.mock('js/authentication/user')
jest.mock('js/mutations/LogSearchMutation')
jest.mock('js/utils/logger')

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

  it('calls fetchBingSearchResults on mount when the query exists', async () => {
    expect.assertions(2)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(fetchBingSearchResults).toHaveBeenCalledTimes(1)
    expect(fetchBingSearchResults).toHaveBeenCalledWith('tacos')
  })

  it('calls fetchBingSearchResults when the query changes', async () => {
    expect.assertions(2)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    fetchBingSearchResults.mockClear()
    wrapper.setProps({ query: 'pizza' })
    expect(fetchBingSearchResults).toHaveBeenCalledTimes(1)
    expect(fetchBingSearchResults).toHaveBeenCalledWith('pizza')
  })

  it('calls fetchBingSearchResults when the page changes', async () => {
    expect.assertions(3)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    fetchBingSearchResults.mockClear()
    expect(fetchBingSearchResults).not.toHaveBeenCalled()
    wrapper.setProps({ page: 2 })
    expect(fetchBingSearchResults).toHaveBeenCalledTimes(1)
    expect(fetchBingSearchResults).toHaveBeenCalledWith('tacos')
  })

  it('does not call fetchBingSearchResults when some unrelated prop changes', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    mockProps.totallyFakeProp = 'hi'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    fetchBingSearchResults.mockClear()
    wrapper.setProps({ totallyFakeProp: 'bye' })
    expect(fetchBingSearchResults).not.toHaveBeenCalled()
  })

  it('does not call fetchBingSearchResults on mount when the query does not exist', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = null
    shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(fetchBingSearchResults).not.toHaveBeenCalled()
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

  it('logs an error when the query request throws', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    const mockErr = new Error('Search did not work.')
    fetchBingSearchResults.mockImplementation(() => {
      throw mockErr
    })
    shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(logger.error).toHaveBeenCalledWith(mockErr)
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

  it('calls the onPageChange prop when clicking to a new results page', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    mockProps.page = 124
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    const onPageChangeTrigger = wrapper
      .find(SearchResultsBing)
      .prop('onPageChange')
    onPageChangeTrigger(12)
    expect(mockProps.onPageChange).toHaveBeenCalledWith(12)
  })

  it('scrolls to the top of the page when clicking to a new results page', async () => {
    expect.assertions(2)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    mockProps.page = 124
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    window.document.body.scrollTop = 829
    expect(window.document.body.scrollTop).toBe(829)
    const onPageChangeTrigger = wrapper
      .find(SearchResultsBing)
      .prop('onPageChange')
    onPageChangeTrigger(12)
    expect(window.document.body.scrollTop).toBe(0)
  })

  it('does not call the onPageChange prop when clicking the current results page', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    mockProps.page = 42
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    const onPageChangeTrigger = wrapper
      .find(SearchResultsBing)
      .prop('onPageChange')
    onPageChangeTrigger(42)
    expect(mockProps.onPageChange).not.toHaveBeenCalled()
  })

  it('does not throw or log an error if the query returns after the component has unmounted', async () => {
    expect.assertions(1)

    // Mock that the Wikipedia request takes some time.
    jest.useFakeTimers()
    fetchBingSearchResults.mockImplementation(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(getMockSuccessfulSearchQuery())
        }, 8e3)
      })
    })
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()

    // Unmount
    wrapper.unmount()

    // Mock that the request returns.
    jest.advanceTimersByTime(10e3)
    await flushAllPromises()

    expect(logger.error).not.toHaveBeenCalled()
  })

  it('logs an error the promise fails for reasons other than being canceled', async () => {
    expect.assertions(1)

    // Mock that the request takes some time.
    jest.useFakeTimers()
    const mockErr = new Error('Oh no!')
    fetchBingSearchResults.mockImplementation(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(mockErr)
        }, 8e3)
      })
    })
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()

    // Mock that the request returns.
    jest.advanceTimersByTime(10e3)
    await flushAllPromises()

    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })

  // TODO: add tests
  // - data is restructured as expected
})
