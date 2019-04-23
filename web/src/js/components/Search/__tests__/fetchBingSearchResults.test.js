/* eslint-env jest */

import { mockFetchResponse } from 'js/utils/test-utils'

jest.mock('js/components/Search/getMockBingSearchResults')

beforeEach(() => {
  process.env.NODE_ENV = 'test'
  process.env.REACT_APP_MOCK_SEARCH_RESULTS = false
  global.fetch.mockImplementation(() => Promise.resolve(mockFetchResponse()))
  jest.useFakeTimers()
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('fetchBingSearchResults', () => {
  it('calls fetch once', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults('blue whales')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('calls the expected endpoint', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults('blue whales')
    expect(fetch.mock.calls[0][0]).toEqual(
      'https://dev-search-api.gladly.io/api/query?q=blue%20whales'
    )
  })

  it('fetches with a GET request', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults('blue whales')
    expect(fetch.mock.calls[0][1]).toMatchObject({
      method: 'GET',
    })
  })

  it('fetches with the expected headers', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults('blue whales')
    expect(fetch.mock.calls[0][1]).toMatchObject({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  })

  it('throws if the provided query is null', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    expect(fetchBingSearchResults(null)).rejects.toThrow(
      'Search query must be a non-empty string.'
    )
  })

  it('throws if the response cannot be converted to JSON', async () => {
    expect.assertions(1)
    global.fetch.mockImplementation(() =>
      Promise.resolve(
        mockFetchResponse({
          json: () => {
            throw new Error('Bad JSON problem!')
          },
        })
      )
    )
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    expect(fetchBingSearchResults('blue whales')).rejects.toThrow(
      'Bad JSON problem!'
    )
  })

  it('calls for mock search results if NODE_ENV=development and REACT_APP_MOCK_SEARCH_RESULTS=true', done => {
    expect.assertions(2)
    process.env.NODE_ENV = 'development'
    process.env.REACT_APP_MOCK_SEARCH_RESULTS = 'true'
    const getMockBingSearchResults = require('js/components/Search/getMockBingSearchResults')
      .default
    getMockBingSearchResults.mockReturnValue({
      some: 'stuff',
    })
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    fetchBingSearchResults('blue whales').then(result => {
      expect(getMockBingSearchResults).toHaveBeenCalledTimes(1)
      expect(result).toEqual({
        some: 'stuff',
      })
      done()
    })
    jest.runAllTimers()
  })

  it('does not use mock search results if NODE_ENV=production, even if REACT_APP_MOCK_SEARCH_RESULTS=true', done => {
    expect.assertions(1)
    process.env.NODE_ENV = 'production'
    process.env.REACT_APP_MOCK_SEARCH_RESULTS = 'true'
    const getMockBingSearchResults = require('js/components/Search/getMockBingSearchResults')
      .default
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    fetchBingSearchResults('blue whales')
      .then(result => {
        expect(getMockBingSearchResults).not.toHaveBeenCalled()
        done()
      })
      .catch(e => {
        throw e
      })
    jest.runAllTimers()
  })

  it('does not use mock search results if REACT_APP_MOCK_SEARCH_RESULTS=false', done => {
    expect.assertions(1)
    process.env.NODE_ENV = 'development'
    process.env.REACT_APP_MOCK_SEARCH_RESULTS = 'false'
    const getMockBingSearchResults = require('js/components/Search/getMockBingSearchResults')
      .default
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    fetchBingSearchResults('blue whales')
      .then(result => {
        expect(getMockBingSearchResults).not.toHaveBeenCalled()
        done()
      })
      .catch(e => {
        throw e
      })
    jest.runAllTimers()
  })
})
