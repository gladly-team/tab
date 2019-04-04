/* eslint-env jest */

import { mockFetchResponse } from 'js/utils/test-utils'

afterEach(() => {
  jest.clearAllMocks()
})

beforeEach(() => {
  global.fetch.mockImplementation(() => Promise.resolve(mockFetchResponse()))
})

describe('fetchWikipediaResults', () => {
  it('calls fetch once', () => {
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    fetchWikipediaResults()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('fetches with a GET request', () => {
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    fetchWikipediaResults()
    expect(fetch.mock.calls[0][1]).toMatchObject({
      method: 'GET',
    })
  })

  it('fetches with the expected headers', () => {
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    fetchWikipediaResults()
    expect(fetch.mock.calls[0][1]).toMatchObject({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  })
})
