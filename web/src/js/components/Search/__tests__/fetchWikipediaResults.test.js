/* eslint-env jest */

import qs from 'qs'
import { mockFetchResponse } from 'js/utils/test-utils'

const getURLParamsObjFromURL = url => {
  const searchStr = new URL(url).search
  const urlParams = qs.parse(searchStr, { ignoreQueryPrefix: true })
  return urlParams
}

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

  it('sets the URL parameter "action" to "query"', async () => {
    expect.assertions(1)
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    await fetchWikipediaResults()
    const urlParams = getURLParamsObjFromURL(fetch.mock.calls[0][0])
    expect(urlParams).toMatchObject({
      action: 'query',
    })
  })

  it('sets the URL parameter "prop" to the expected Wikipedia page properies to fetch', async () => {
    expect.assertions(1)
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    await fetchWikipediaResults()
    const expectedPageProps = [
      'description',
      'extracts',
      'imageinfo',
      'images',
      'info',
      'pageimages',
    ].join('|')
    const urlParams = getURLParamsObjFromURL(fetch.mock.calls[0][0])
    expect(urlParams).toMatchObject({
      prop: expectedPageProps,
    })
  })

  it('sets the URL parameters for a JSON v2 response format', async () => {
    expect.assertions(1)
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    await fetchWikipediaResults()
    const urlParams = getURLParamsObjFromURL(fetch.mock.calls[0][0])
    expect(urlParams).toMatchObject({
      format: 'json',
      formatversion: '2',
    })
  })

  it('sets the URL parameters for the Wikipedia extracts settings', async () => {
    expect.assertions(1)
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    await fetchWikipediaResults()
    const urlParams = getURLParamsObjFromURL(fetch.mock.calls[0][0])
    expect(urlParams).toMatchObject({
      exintro: 'true',
      exlimit: '3',
      exsentences: '1',
    })
  })

  it('sets the URL parameters for the Wikipedia generator settings', async () => {
    expect.assertions(1)
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    await fetchWikipediaResults()
    const urlParams = getURLParamsObjFromURL(fetch.mock.calls[0][0])
    expect(urlParams).toMatchObject({
      generator: 'prefixsearch',
      gpslimit: '1',
    })
  })

  it('sets the URL parameters for the Wikipedia query string', async () => {
    expect.assertions(1)
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    await fetchWikipediaResults()
    const urlParams = getURLParamsObjFromURL(fetch.mock.calls[0][0])
    expect(urlParams).toMatchObject({
      gpsnamespace: '0',
      gpssearch: '',
    })
  })

  it('sets the URL parameters for the Wikipedia image settings', async () => {
    expect.assertions(1)
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    await fetchWikipediaResults()
    const urlParams = getURLParamsObjFromURL(fetch.mock.calls[0][0])
    expect(urlParams).toMatchObject({
      imlimit: '4',
    })
  })

  it('sets the URL parameters for the Wikipedia page info settings', async () => {
    expect.assertions(1)
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    await fetchWikipediaResults()
    const urlParams = getURLParamsObjFromURL(fetch.mock.calls[0][0])
    expect(urlParams).toMatchObject({
      inprop: 'url',
    })
  })

  it('sets the URL parameters for the Wikipedia page image settings', async () => {
    expect.assertions(1)
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    await fetchWikipediaResults()
    const urlParams = getURLParamsObjFromURL(fetch.mock.calls[0][0])
    expect(urlParams).toMatchObject({
      pilimit: '1',
      pithumbsize: '200',
    })
  })

  it('sets the URL parameter "redirects" to "true"', async () => {
    expect.assertions(1)
    const fetchWikipediaResults = require('js/components/Search/fetchWikipediaResults')
      .default
    await fetchWikipediaResults()
    const urlParams = getURLParamsObjFromURL(fetch.mock.calls[0][0])
    expect(urlParams).toMatchObject({
      redirects: 'true',
    })
  })
})
