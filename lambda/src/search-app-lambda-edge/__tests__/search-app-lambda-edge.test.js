/* eslint-env jest */

import { clone } from 'lodash/lang'
import { setWith } from 'lodash/object'
import {
  getMockCloudFrontEventObject,
  getMockLambdaContext,
} from '../../utils/lambda-arg-utils'
import searchURLByRegion from '../searchURLByRegion'

jest.mock('../searchURLByRegion')

const callback = jest.fn()
const MOCK_V2_SEARCH_URL =
  'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001'

beforeEach(() => {
  searchURLByRegion.mockReturnValue(MOCK_V2_SEARCH_URL)
})

afterEach(() => {
  jest.clearAllMocks()
})

const searchV1Path = '/search/'
const searchV2Path = '/search/v2'
const setEventURI = (event, uri) => {
  // Like `set` but immutable:
  // https://github.com/lodash/lodash/issues/1696#issuecomment-328335502
  return setWith(clone(event), 'Records[0].cf.request.uri', uri, clone)
}

const setHeader = (event, headerName, headerVal) => {
  return setWith(
    clone(event),
    `Records[0].cf.request.headers.${headerName}`,
    [
      {
        // Not quite correct (the key will be Pascal-cased) but fine for these tests.
        key: headerName,
        value: headerVal,
      },
    ],
    clone
  )
}

describe('v1: search app Lambda@Edge function on viewer-request', () => {
  it('redirects with a 307 redirect', () => {
    expect.assertions(2)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV1Path)
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.status).toEqual('307')
    expect(response.statusDescription).toEqual('Found')
  })

  it('redirects an empty search to Google without a query string', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV1Path)
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search'
    )
  })

  it('sets the query string value if the "q" value is defined', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV1Path)
    event.Records[0].cf.request.querystring = 'q=pizza'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza'
    )
  })

  it('sets the query string value if the "q" value is defined with a space character', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV1Path)
    event.Records[0].cf.request.querystring = 'q=pizza+palace'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza+palace'
    )
  })

  it('sets the query string value if the "q" value is defined with a special character', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV1Path)
    event.Records[0].cf.request.querystring = 'q=pizza🍕'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza%F0%9F%8D%95'
    )
  })

  it('only sets the "q" query string value, ignoring other URL params', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV1Path)
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza&src=foo'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza'
    )
  })
})

describe('v2: search app Lambda@Edge function on viewer-request', () => {
  it('redirects with a 307 redirect', () => {
    expect.assertions(2)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.status).toEqual('307')
    expect(response.statusDescription).toEqual('Found')
  })

  it('redirects an empty search to Yahoo without a query string', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.headers.location[0].value).toEqual(MOCK_V2_SEARCH_URL)
  })

  it('uses the v2 API if the URI has a trailing slash', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, '/search/v2/')
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.headers.location[0].value).toEqual(MOCK_V2_SEARCH_URL)
  })

  it('sets the query string value if the "q" value is defined', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring = 'q=pizza'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&p=pizza'
    )
  })

  it('sets the query string value if the "q" value is defined with a space character', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring = 'q=pizza+palace'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&p=pizza+palace'
    )
  })

  it('sets the query string value if the "q" value is defined with a special character', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring = 'q=pizza🍕'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&p=pizza%F0%9F%8D%95'
    )
  })

  it('only sets the "q" query string value, ignoring other unused URL params', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza&blah=foo'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&p=pizza'
    )
  })

  // TODO
  // it('sets the "type" string with an empty cause ID, source of search, and referral ID', () => {
  //   expect.assertions(1)
  //   const { handler } = require('../search-app-lambda-edge')
  //   const defaultEvent = getMockCloudFrontEventObject()
  //   const event = setEventURI(defaultEvent, searchV2Path)
  //   event.Records[0].cf.request.querystring = 'hi=there&q=pizza&src=foo'
  //   const context = getMockLambdaContext()
  //   handler(event, context, callback)
  //   const response = callback.mock.calls[0][1]
  //   expect(response.headers.location[0].value).toEqual(
  //     'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&p=pizza'
  //   )
  // })

  it('passes the expected header values to `searchURLByRegion`', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setHeader(
      setHeader(
        setEventURI(defaultEvent, searchV2Path),
        'cloudfront-viewer-country',
        'MX'
      ),
      'accept-language',
      'es'
    )
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza&src=foo'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    expect(searchURLByRegion).toHaveBeenCalledWith('MX', 'es')
  })
})
