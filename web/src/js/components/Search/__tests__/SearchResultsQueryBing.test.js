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
import { getCurrentUser } from 'js/authentication/user'
import { setBingClientID } from 'js/utils/local-user-data-mgr'
import { isReactSnapClient } from 'js/utils/search-utils'

jest.mock('js/components/Search/fetchBingSearchResults')
jest.mock('js/components/Search/SearchResultsBing')
jest.mock('js/authentication/user')
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
    expect(fetchBingSearchResults).toHaveBeenCalledWith({
      query: 'tacos',
      page: 1,
    })
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
    expect(fetchBingSearchResults).toHaveBeenCalledWith({
      query: 'pizza',
      page: 1,
    })
  })

  it('calls fetchBingSearchResults when the page changes, passing the new page number', async () => {
    expect.assertions(3)
    const SearchResultsQueryBing = require('js/components/Search/SearchResultsQueryBing')
      .default
    const mockProps = getMockProps()
    mockProps.query = 'tacos'
    const wrapper = shallow(<SearchResultsQueryBing {...mockProps} />)
    await flushAllPromises()
    fetchBingSearchResults.mockClear()
    expect(fetchBingSearchResults).not.toHaveBeenCalled()
    wrapper.setProps({ page: 48 })
    expect(fetchBingSearchResults).toHaveBeenCalledTimes(1)
    expect(fetchBingSearchResults).toHaveBeenCalledWith({
      query: 'tacos',
      page: 48,
    })
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
      instrumentation: {
        _type: 'ResponseInstrumentation',
        pageLoadPingUrl:
          'https://www.bingapis.com/api/ping/pageload?Some=Data&Type=Thing',
        pingUrlBase: 'https://www.bingapis.com/api/ping?Some=Data',
      },
      resultsCount: 5250000,
      results: {
        mainline: [
          {
            key: 'TimeZone-https://www.bing.com/api/v7/#TimeZone',
            type: 'TimeZone',
            value: {
              id: 'https://www.bing.com/api/v7/#TimeZone',
              otherCityTimes: [
                {
                  location: 'Pensacola',
                  time: '2015-10-23T12:04:56.6664294Z',
                  utcOffset: 'UTC-5',
                },
              ],
              primaryCityTime: {
                location: 'Tallahassee, Florida, United States',
                time: '2015-10-23T13:04:56.6774389Z',
                utcOffset: 'UTC-4',
              },
            },
          },
          {
            key: 'Computation-https://www.bingapis.com/api/v7/#Computation',
            type: 'Computation',
            value: {
              expression: 'sqrt((4^2) + (8^2))',
              id: 'https://www.bingapis.com/api/v7/#Computation',
              value: '8.94427191',
            },
          },
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
          {
            key: 'Videos',
            type: 'Videos',
            value: [
              {
                allowHttpsEmbed: true,
                allowMobileEmbed: true,
                contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                datePublished: '2009-10-25T06:57:33.0000000',
                description:
                  'Rick Astley - Never Gonna Give You Up (Official Video) - Listen On Spotify: http://smarturl.it/AstleySpotify Learn more about the brand new album ‘Beautiful Life’: https://RickAstley.lnk.to/BeautifulLi... Buy On iTunes: http://smarturl.it/AstleyGHiTunes Amazon: http://smarturl.it/AstleyGHAmazon Follow Rick Astley Website: http://www ...',
                duration: 'PT3M33S',
                embedHtml:
                  '<iframe width="1280" height="720" src="http://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen></iframe>',
                encodingFormat: 'mp4',
                height: 720,
                hostPageDisplayUrl:
                  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                hostPageUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                hostPageUrlPingSuffix: 'DevEx,5617.1',
                isAccessibleForFree: true,
                isSuperfresh: false,
                motionThumbnailUrl:
                  'https://tse3.mm.bing.net/th?id=OM.NrH36WeODxx7Tg_1557133268&pid=Api',
                name: 'Rick Astley - Never Gonna Give You Up (Video)',
                publisher: [{ name: 'YouTube' }],
                thumbnail: { width: 160, height: 119 },
                thumbnailUrl:
                  'https://tse3.mm.bing.net/th?id=OVP.6PGH-QJhVEnKeMu2-91ajQHfFn&pid=Api',
                viewCount: 573320051,
                webSearchUrl:
                  'https://www.bing.com/videos/search?q=rick%20roll&view=detail&mid=4E7B1C0F8E67E9F7B1364E7B1C0F8E67E9F7B136',
                webSearchUrlPingSuffix: 'DevEx,5618.1',
                width: 1280,
              },
              {
                allowHttpsEmbed: true,
                allowMobileEmbed: true,
                contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                datePublished: '2009-10-25T06:57:33.0000000',
                description:
                  'Rick Astley - Never Gonna Give You Up (Official Video) - Listen On Spotify: http://smarturl.it/AstleySpotify Learn more about the brand new album ‘Beautiful Life’: https://RickAstley.lnk.to/BeautifulLi... Buy On iTunes: http://smarturl.it/AstleyGHiTunes Amazon: http://smarturl.it/AstleyGHAmazon Follow Rick Astley Website: http://www ...',
                duration: 'PT3M33S',
                embedHtml:
                  '<iframe width="1280" height="720" src="http://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen></iframe>',
                encodingFormat: 'mp4',
                height: 720,
                hostPageDisplayUrl:
                  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                hostPageUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                hostPageUrlPingSuffix: 'DevEx,5617.1',
                isAccessibleForFree: true,
                isSuperfresh: false,
                motionThumbnailUrl:
                  'https://tse3.mm.bing.net/th?id=OM.NrH36WeODxx7Tg_1557133268&pid=Api',
                name: 'Rick Astley - Never Gonna Give You Up (Video)',
                publisher: [{ name: 'YouTube' }],
                thumbnail: { width: 160, height: 119 },
                thumbnailUrl:
                  'https://tse3.mm.bing.net/th?id=OVP.6PGH-QJhVEnKeMu2-91ajQHfFn&pid=Api',
                viewCount: 573320051,
                webSearchUrl:
                  'https://www.bing.com/videos/search?q=rick%20roll&view=detail&mid=4E7B1C0F8E67E9F7B1364E7B1C0F8E67E9F7B136',
                webSearchUrlPingSuffix: 'DevEx,5618.1',
                width: 1280,
              },
              {
                allowHttpsEmbed: true,
                allowMobileEmbed: true,
                contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                datePublished: '2009-10-25T06:57:33.0000000',
                description:
                  'Rick Astley - Never Gonna Give You Up (Official Video) - Listen On Spotify: http://smarturl.it/AstleySpotify Learn more about the brand new album ‘Beautiful Life’: https://RickAstley.lnk.to/BeautifulLi... Buy On iTunes: http://smarturl.it/AstleyGHiTunes Amazon: http://smarturl.it/AstleyGHAmazon Follow Rick Astley Website: http://www ...',
                duration: 'PT3M33S',
                embedHtml:
                  '<iframe width="1280" height="720" src="http://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen></iframe>',
                encodingFormat: 'mp4',
                height: 720,
                hostPageDisplayUrl:
                  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                hostPageUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                hostPageUrlPingSuffix: 'DevEx,5617.1',
                isAccessibleForFree: true,
                isSuperfresh: false,
                motionThumbnailUrl:
                  'https://tse3.mm.bing.net/th?id=OM.NrH36WeODxx7Tg_1557133268&pid=Api',
                name: 'Rick Astley - Never Gonna Give You Up (Video)',
                publisher: [{ name: 'YouTube' }],
                thumbnail: { width: 160, height: 119 },
                thumbnailUrl:
                  'https://tse3.mm.bing.net/th?id=OVP.6PGH-QJhVEnKeMu2-91ajQHfFn&pid=Api',
                viewCount: 573320051,
                webSearchUrl:
                  'https://www.bing.com/videos/search?q=rick%20roll&view=detail&mid=4E7B1C0F8E67E9F7B1364E7B1C0F8E67E9F7B136',
                webSearchUrlPingSuffix: 'DevEx,5618.1',
                width: 1280,
              },
              {
                allowHttpsEmbed: true,
                allowMobileEmbed: true,
                contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                datePublished: '2009-10-25T06:57:33.0000000',
                description:
                  'Rick Astley - Never Gonna Give You Up (Official Video) - Listen On Spotify: http://smarturl.it/AstleySpotify Learn more about the brand new album ‘Beautiful Life’: https://RickAstley.lnk.to/BeautifulLi... Buy On iTunes: http://smarturl.it/AstleyGHiTunes Amazon: http://smarturl.it/AstleyGHAmazon Follow Rick Astley Website: http://www ...',
                duration: 'PT3M33S',
                embedHtml:
                  '<iframe width="1280" height="720" src="http://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen></iframe>',
                encodingFormat: 'mp4',
                height: 720,
                hostPageDisplayUrl:
                  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                hostPageUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                hostPageUrlPingSuffix: 'DevEx,5617.1',
                isAccessibleForFree: true,
                isSuperfresh: false,
                motionThumbnailUrl:
                  'https://tse3.mm.bing.net/th?id=OM.NrH36WeODxx7Tg_1557133268&pid=Api',
                name: 'Rick Astley - Never Gonna Give You Up (Video)',
                publisher: [{ name: 'YouTube' }],
                thumbnail: { width: 160, height: 119 },
                thumbnailUrl:
                  'https://tse3.mm.bing.net/th?id=OVP.6PGH-QJhVEnKeMu2-91ajQHfFn&pid=Api',
                viewCount: 573320051,
                webSearchUrl:
                  'https://www.bing.com/videos/search?q=rick%20roll&view=detail&mid=4E7B1C0F8E67E9F7B1364E7B1C0F8E67E9F7B136',
                webSearchUrlPingSuffix: 'DevEx,5618.1',
                width: 1280,
              },
            ],
          },
        ],
        pole: [],
        sidebar: [],
      },
    })
  })
})
