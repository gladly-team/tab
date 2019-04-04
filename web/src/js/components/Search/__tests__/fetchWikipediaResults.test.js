/* eslint-env jest */

import { mockFetchResponse } from 'js/utils/test-utils'

beforeEach(() => {
  global.fetch.mockImplementation(() => Promise.resolve(mockFetchResponse()))
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('fetchWikipediaResults', () => {
  expect.assertions(1)
  it('calls fetch once', async () => {
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    await fetchWikipediaResults()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('fetches with a GET request', async () => {
    expect.assertions(1)
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    await fetchWikipediaResults()
    expect(fetch.mock.calls[0][1]).toMatchObject({
      method: 'GET',
    })
  })

  it('fetches with the expected headers', async () => {
    expect.assertions(1)
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    await fetchWikipediaResults()
    expect(fetch.mock.calls[0][1]).toMatchObject({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  })

  it('throws if fetch throws an error', async () => {
    expect.assertions(1)
    global.fetch.mockImplementation(() =>
      Promise.reject(new Error('I failed to fetch'))
    )
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    expect(fetchWikipediaResults()).rejects.toThrow('I failed to fetch')
  })

  it('throws if response.json() throws an error', async () => {
    expect.assertions(1)
    global.fetch.mockImplementation(() =>
      Promise.resolve(
        mockFetchResponse({
          json: () => Promise.reject(new Error('Bad JSON!')),
        })
      )
    )
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    expect(fetchWikipediaResults()).rejects.toThrow('Bad JSON!')
  })
})
