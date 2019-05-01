/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import {
  getMockSuccessfulSearchQuery,
  getMockErrorSearchQuery,
} from 'js/utils/test-utils-search'
import fetchBingSearchResults from 'js/components/Search/fetchBingSearchResults'
import { flushAllPromises } from 'js/utils/test-utils'
import SearchResultsBing from 'js/components/Search/SearchResultsBing'
import logger from 'js/utils/logger'
import LogSearchMutation from 'js/mutations/LogSearchMutation'
import { getCurrentUser } from 'js/authentication/user'
import { setBingClientID } from 'js/utils/local-user-data-mgr'
import {
  isReactSnapClient,
  getSearchResultCountPerPage,
} from 'js/utils/search-utils'

jest.mock('js/components/Search/fetchBingSearchResults')
jest.mock('js/components/Search/SearchResultsBing')
jest.mock('js/authentication/user')
jest.mock('js/mutations/LogSearchMutation')
jest.mock('js/utils/logger')
jest.mock('js/utils/local-user-data-mgr')
jest.mock('js/utils/search-utils')

const getMockProps = () => ({
  query: undefined,
  page: undefined,
  onPageChange: jest.fn(),
  searchSource: undefined,
})

beforeEach(() => {
  jest.clearAllMocks()
  getSearchResultCountPerPage.mockReturnValue(10)
  fetchBingSearchResults.mockResolvedValue(getMockSuccessfulSearchQuery())
  getCurrentUser.mockResolvedValue({
    id: 'abc123xyz789',
    email: 'example@example.com',
    username: 'example',
    isAnonymous: false,
    emailVerified: true,
  })
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
    expect(fetchBingSearchResults).toHaveBeenCalledWith('tacos', {})
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
    expect(fetchBingSearchResults).toHaveBeenCalledWith('pizza', {})
  })

  it('calls fetchBingSearchResults when the page changes', async () => {
    expect.assertions(3)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    getSearchResultCountPerPage.mockReturnValue(10)
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    fetchBingSearchResults.mockClear()
    expect(fetchBingSearchResults).not.toHaveBeenCalled()
    wrapper.setProps({ page: 2 })
    expect(fetchBingSearchResults).toHaveBeenCalledTimes(1)
    expect(fetchBingSearchResults).toHaveBeenCalledWith('tacos', { offset: 10 })
  })

  it('calls fetchBingSearchResults with the expected offset value based on the page number and results per page', async () => {
    expect.assertions(5)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()

    // No offset value for the first page.
    mockProps.query = 'tacos'
    mockProps.page = 1
    getSearchResultCountPerPage.mockReturnValue(10)
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(fetchBingSearchResults.mock.calls[0][1]).not.toHaveProperty('offset')
    fetchBingSearchResults.mockClear()

    // Expected offset value for the second page.
    wrapper.setProps({ page: 2 })
    expect(fetchBingSearchResults.mock.calls[0][1]).toHaveProperty('offset', 10)
    fetchBingSearchResults.mockClear()

    // Expected offset value for the eighth page.
    wrapper.setProps({ page: 8 })
    expect(fetchBingSearchResults.mock.calls[0][1]).toHaveProperty('offset', 70)
    fetchBingSearchResults.mockClear()

    // The offset for the pages changes if we change how many
    // results per page to show.
    getSearchResultCountPerPage.mockReturnValue(12)
    wrapper.setProps({ page: 3 })
    expect(fetchBingSearchResults.mock.calls[0][1]).toHaveProperty('offset', 24)
    fetchBingSearchResults.mockClear()

    wrapper.setProps({ page: 8 })
    expect(fetchBingSearchResults.mock.calls[0][1]).toHaveProperty('offset', 84)
    fetchBingSearchResults.mockClear()
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

  it('calls LogSearchMutation on mount when the query exists', async () => {
    expect.assertions(2)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(LogSearchMutation).toHaveBeenCalledTimes(1)
    expect(LogSearchMutation).toHaveBeenCalledWith({ userId: 'abc123xyz789' })
  })

  it('calls LogSearchMutation when the query changes', async () => {
    expect.assertions(2)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    LogSearchMutation.mockClear()
    wrapper.setProps({ query: 'pizza' })
    await flushAllPromises()
    expect(LogSearchMutation).toHaveBeenCalledTimes(1)
    expect(LogSearchMutation).toHaveBeenCalledWith({ userId: 'abc123xyz789' })
  })

  it('calls LogSearchMutation when the page changes', async () => {
    expect.assertions(3)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    LogSearchMutation.mockClear()
    expect(LogSearchMutation).not.toHaveBeenCalled()
    wrapper.setProps({ page: 2 })
    await flushAllPromises()
    expect(LogSearchMutation).toHaveBeenCalledTimes(1)
    expect(LogSearchMutation).toHaveBeenCalledWith({ userId: 'abc123xyz789' })
  })

  it('does not call LogSearchMutation when some unrelated prop changes', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    mockProps.totallyFakeProp = 'hi'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    LogSearchMutation.mockClear()
    wrapper.setProps({ totallyFakeProp: 'bye' })
    expect(LogSearchMutation).not.toHaveBeenCalled()
  })

  it('does not call LogSearchMutation on mount when the query does not exist', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = null
    shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(LogSearchMutation).not.toHaveBeenCalled()
  })

  it('does not calls LogSearchMutation when the user is not authenticated', async () => {
    expect.assertions(1)
    getCurrentUser.mockResolvedValue({
      id: null,
      email: null,
      username: null,
      isAnonymous: false,
      emailVerified: false,
    })
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(LogSearchMutation).not.toHaveBeenCalled()
  })

  it('calls LogSearchMutation with the search source, if provided', async () => {
    expect.assertions(2)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    mockProps.searchSource = 'some-source'
    shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(LogSearchMutation).toHaveBeenCalledTimes(1)
    expect(LogSearchMutation).toHaveBeenCalledWith({
      source: 'some-source',
      userId: 'abc123xyz789',
    })
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

  it('passes isEmptyQuery=true to SearchResultsBing when the query does not exist', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = null
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(wrapper.find(SearchResultsBing).prop('isEmptyQuery')).toBe(true)
  })

  it('passes isEmptyQuery=false to SearchResultsBing when the query does not exist but we are prerendering the HTML', async () => {
    expect.assertions(1)
    isReactSnapClient.mockReturnValue(true)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = null
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(wrapper.find(SearchResultsBing).prop('isEmptyQuery')).toBe(false)
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
    expect.assertions(4)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'

    // Mock that the request takes some time.
    jest.useFakeTimers()
    fetchBingSearchResults.mockImplementation(() => {
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

    // A new search should reset isQueryInProgress to true.
    wrapper.setProps({ query: 'something else' })
    expect(wrapper.find(SearchResultsBing).prop('isQueryInProgress')).toBe(true)

    // Mock that the request returns.
    jest.advanceTimersByTime(10e3)
    await flushAllPromises()

    expect(wrapper.find(SearchResultsBing).prop('isQueryInProgress')).toBe(
      false
    )
  })

  it('passes queryReturned=false to SearchResultsBing when the query is pending and true when it is complete', async () => {
    expect.assertions(4)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'

    // Mock that the request takes some time.
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
    expect(wrapper.find(SearchResultsBing).prop('queryReturned')).toBe(false)

    // Mock that the request returns.
    jest.advanceTimersByTime(10e3)
    await flushAllPromises()

    expect(wrapper.find(SearchResultsBing).prop('queryReturned')).toBe(true)

    // A new search should reset queryReturned to false.
    wrapper.setProps({ query: 'something else' })
    expect(wrapper.find(SearchResultsBing).prop('queryReturned')).toBe(false)

    // Mock that the request returns.
    jest.advanceTimersByTime(10e3)
    await flushAllPromises()

    expect(wrapper.find(SearchResultsBing).prop('queryReturned')).toBe(true)
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

  it('passes isError=false to SearchResultsBing when fetching Bing results is successful', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(wrapper.find(SearchResultsBing).prop('isError')).toBe(false)
  })

  it('passes isError=true to SearchResultsBing when fetching Bing results throws', async () => {
    expect.assertions(2)

    // Mock that the request throws an error.
    const mockErr = new Error('Oh no!')
    fetchBingSearchResults.mockImplementation(() => {
      return new Promise((resolve, reject) => reject(mockErr))
    })
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(wrapper.find(SearchResultsBing).prop('isError')).toBe(true)

    // If a new search succeeds, isError should be false.
    fetchBingSearchResults.mockResolvedValue(getMockSuccessfulSearchQuery())
    wrapper.setProps({ query: 'something else' })
    await flushAllPromises()
    expect(wrapper.find(SearchResultsBing).prop('isError')).toBe(false)
  })

  it('passes isError=true to SearchResultsBing when Bing returns an error object', async () => {
    expect.assertions(1)

    // Mock that Bing returns an error.
    fetchBingSearchResults.mockResolvedValue(getMockErrorSearchQuery())
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(wrapper.find(SearchResultsBing).prop('isError')).toBe(true)
  })

  it('logs errors when Bing returns an error object', async () => {
    expect.assertions(3)

    // Mock that Bing returns errors.
    const mockErrResponse = getMockErrorSearchQuery()
    const response = {
      ...mockErrResponse,
      bing: {
        ...mockErrResponse.bing,
        errors: [
          {
            code: 'InvalidAuthorization',
            subCode: 'AuthorizationMissing',
            message: 'Authorization is required.',
            moreDetails: 'Subscription key is not recognized.',
          },
          {
            code: 'InvalidRequest',
            subCode: 'ParameterMissing',
            message: 'Required parameter is missing.',
            parameter: 'q',
          },
        ],
      },
    }
    fetchBingSearchResults.mockResolvedValue(response)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(logger.error).toHaveBeenCalledTimes(2)
    expect(logger.error).toHaveBeenCalledWith({
      code: 'InvalidAuthorization',
      subCode: 'AuthorizationMissing',
      message: 'Authorization is required.',
      moreDetails: 'Subscription key is not recognized.',
    })
    expect(logger.error).toHaveBeenCalledWith({
      code: 'InvalidRequest',
      subCode: 'ParameterMissing',
      message: 'Required parameter is missing.',
      parameter: 'q',
    })
  })

  it('calls to set the Bing ID in local storage when the response includes a Bing ID', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'

    const mockResponse = getMockSuccessfulSearchQuery()
    const mockResponseWithBingId = {
      ...mockResponse,
      bingExtras: {
        ...mockResponse.bingExtras,
        msEdgeClientID: 'qwerty-123',
      },
    }
    fetchBingSearchResults.mockResolvedValue(mockResponseWithBingId)

    shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(setBingClientID).toHaveBeenCalledWith('qwerty-123')
  })

  it('does not call to set the Bing ID in local storage when the response does not include a Bing ID', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'

    const mockResponse = getMockSuccessfulSearchQuery()
    const mockResponseWithBingId = {
      ...mockResponse,
      bingExtras: {
        ...mockResponse.bingExtras,
        msEdgeClientID: null,
      },
    }
    fetchBingSearchResults.mockResolvedValue(mockResponseWithBingId)

    shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    expect(setBingClientID).not.toHaveBeenCalled()
  })

  it('passes the expected data structure to SearchResultsBing', async () => {
    expect.assertions(1)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    const passedData = wrapper.find(SearchResultsBing).prop('data')
    expect(passedData).toEqual({
      mainline: [
        {
          key:
            'WebPages-https://api.cognitive.microsoft.com/api/v7/#WebPages.0',
          type: 'WebPages',
          value: {
            dateLastCrawled: '2018-12-24T15:23:39',
            deepLinks: [
              {
                name: 'This site is related',
                snippet: 'This is a snippet related to the site.',
                url: expect.any(String),
                urlPingSuffix: 'something',
              },
              {
                name: 'This site is related',
                snippet: 'This is a snippet related to the site.',
                url: expect.any(String),
                urlPingSuffix: 'something',
              },
            ],
            displayUrl: 'https://example.com',
            id: expect.any(String),
            name: 'A <b>Really Awesome</b> Webpage',
            searchTags: [],
            snippet:
              "This <b>really awesome</b> website is definitely what you're looking for.",
            url: expect.any(String),
          },
        },
        {
          key: 'News',
          type: 'News',
          value: [
            {
              category: 'Politics',
              clusteredArticles: undefined,
              contractualRules: [
                {
                  _type: 'ContractualRules/TextAttribution',
                  text: 'A Good News Site',
                },
              ],
              datePublished: '2018-12-24T15:23:39',
              description:
                'Something <b>truly incredible</b> and newsworthy happened! Wow. You cannot miss this article.',
              headline: undefined,
              id: expect.any(String),
              image: {
                contentUrl: 'https://media.example.com/foo.png',
                thumbnail: {
                  contentUrl: 'https://www.bing.com/some-url/',
                  height: 466,
                  width: 700,
                },
              },
              mentions: [
                {
                  name: 'New York City',
                },
                {
                  name: 'Madonna',
                },
              ],
              name: 'An <b>Incredible</b> Event in NYC',
              provider: [
                {
                  _type: 'Organization',
                  image: {
                    thumbnail: {
                      contentUrl: 'https://www.bing.com/some-image-url/',
                    },
                  },
                  name: 'A Good News Site',
                },
              ],
              url: expect.any(String),
              video: undefined,
            },
            {
              category: 'Politics',
              clusteredArticles: undefined,
              contractualRules: [
                {
                  _type: 'ContractualRules/TextAttribution',
                  text: 'A Good News Site',
                },
              ],
              datePublished: '2018-12-24T15:23:39',
              description:
                'Something <b>truly incredible</b> and newsworthy happened! Wow. You cannot miss this article.',
              headline: undefined,
              id: expect.any(String),
              image: {
                contentUrl: 'https://media.example.com/foo.png',
                thumbnail: {
                  contentUrl: 'https://www.bing.com/some-url/',
                  height: 466,
                  width: 700,
                },
              },
              mentions: [
                {
                  name: 'New York City',
                },
                {
                  name: 'Madonna',
                },
              ],
              name: 'An <b>Incredible</b> Event in NYC',
              provider: [
                {
                  _type: 'Organization',
                  image: {
                    thumbnail: {
                      contentUrl: 'https://www.bing.com/some-image-url/',
                    },
                  },
                  name: 'A Good News Site',
                },
              ],
              url: expect.any(String),
              video: undefined,
            },
            {
              category: 'Politics',
              clusteredArticles: undefined,
              contractualRules: [
                {
                  _type: 'ContractualRules/TextAttribution',
                  text: 'A Good News Site',
                },
              ],
              datePublished: '2018-12-24T15:23:39',
              description:
                'Something <b>truly incredible</b> and newsworthy happened! Wow. You cannot miss this article.',
              headline: undefined,
              id: expect.any(String),
              image: {
                contentUrl: 'https://media.example.com/foo.png',
                thumbnail: {
                  contentUrl: 'https://www.bing.com/some-url/',
                  height: 466,
                  width: 700,
                },
              },
              mentions: [
                {
                  name: 'New York City',
                },
                {
                  name: 'Madonna',
                },
              ],
              name: 'An <b>Incredible</b> Event in NYC',
              provider: [
                {
                  _type: 'Organization',
                  image: {
                    thumbnail: {
                      contentUrl: 'https://www.bing.com/some-image-url/',
                    },
                  },
                  name: 'A Good News Site',
                },
              ],
              url: expect.any(String),
              video: undefined,
            },
            {
              category: 'Politics',
              clusteredArticles: undefined,
              contractualRules: [
                {
                  _type: 'ContractualRules/TextAttribution',
                  text: 'A Good News Site',
                },
              ],
              datePublished: '2018-12-24T15:23:39',
              description:
                'Something <b>truly incredible</b> and newsworthy happened! Wow. You cannot miss this article.',
              headline: undefined,
              id: expect.any(String),
              image: {
                contentUrl: 'https://media.example.com/foo.png',
                thumbnail: {
                  contentUrl: 'https://www.bing.com/some-url/',
                  height: 466,
                  width: 700,
                },
              },
              mentions: [
                {
                  name: 'New York City',
                },
                {
                  name: 'Madonna',
                },
              ],
              name: 'An <b>Incredible</b> Event in NYC',
              provider: [
                {
                  _type: 'Organization',
                  image: {
                    thumbnail: {
                      contentUrl: 'https://www.bing.com/some-image-url/',
                    },
                  },
                  name: 'A Good News Site',
                },
              ],
              url: expect.any(String),
              video: undefined,
            },
          ],
        },
        {
          key:
            'WebPages-https://api.cognitive.microsoft.com/api/v7/#WebPages.1',
          type: 'WebPages',
          value: {
            dateLastCrawled: '2018-12-24T15:23:39',
            deepLinks: [
              {
                name: 'This site is related',
                snippet: 'This is a snippet related to the site.',
                url: expect.any(String),
                urlPingSuffix: 'something',
              },
              {
                name: 'This site is related',
                snippet: 'This is a snippet related to the site.',
                url: expect.any(String),
                urlPingSuffix: 'something',
              },
            ],
            displayUrl: 'https://example.com',
            id: expect.any(String),
            name: 'A <b>Really Awesome</b> Webpage',
            searchTags: [],
            snippet:
              "This <b>really awesome</b> website is definitely what you're looking for.",
            url: expect.any(String),
          },
        },
        {
          key:
            'WebPages-https://api.cognitive.microsoft.com/api/v7/#WebPages.2',
          type: 'WebPages',
          value: {
            dateLastCrawled: '2018-12-24T15:23:39',
            deepLinks: [
              {
                name: 'This site is related',
                snippet: 'This is a snippet related to the site.',
                url: expect.any(String),
                urlPingSuffix: 'something',
              },
              {
                name: 'This site is related',
                snippet: 'This is a snippet related to the site.',
                url: expect.any(String),
                urlPingSuffix: 'something',
              },
            ],
            displayUrl: 'https://example.com',
            id: expect.any(String),
            name: 'A <b>Really Awesome</b> Webpage',
            searchTags: [],
            snippet:
              "This <b>really awesome</b> website is definitely what you're looking for.",
            url: expect.any(String),
          },
        },
      ],
      pole: [],
      sidebar: [],
    })
  })
})
