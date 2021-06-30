/* eslint-env jest */

import {
  getMockCloudFrontEventObject,
  getMockLambdaContext,
} from '../../utils/lambda-arg-utils'

const callback = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})

describe('search app Lambda@Edge function on viewer-request', () => {
  it('redirects with a 307 redirect', () => {
    expect.assertions(2)
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.status).toEqual('307')
    expect(response.statusDescription).toEqual('Found')
  })

  it('redirects an empty search to Google without a query string', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/'
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
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/'
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
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/'
    event.Records[0].cf.request.querystring = 'q=pizza+palace'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza%20palace'
    )
  })

  it('sets the query string value if the "q" value is defined with a special character', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/'
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
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/'
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza&src=foo'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza'
    )
  })
})
