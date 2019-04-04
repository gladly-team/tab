/* eslint-env jest */

import { mockFetchResponse } from 'js/utils/test-utils'

afterEach(() => {
  jest.clearAllMocks()
})

beforeEach(() => {
  global.fetch.mockImplementation(
    () =>
      new Promise((resolve, reject) => {
        resolve(mockFetchResponse({}))
      })
  )
})

describe('fetchWikipediaResults', () => {
  it('calls fetch once', () => {
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    fetchWikipediaResults()
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
