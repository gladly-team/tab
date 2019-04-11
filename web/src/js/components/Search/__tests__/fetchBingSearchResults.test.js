/* eslint-env jest */

import { mockFetchResponse } from 'js/utils/test-utils'

// TODO: add tests

beforeEach(() => {
  process.env.REACT_APP_MOCK_SEARCH_RESULTS = false
  global.fetch.mockImplementation(() => Promise.resolve(mockFetchResponse()))
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
})
