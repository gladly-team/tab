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
  it('modifies the destination domain to Google', () => {
    expect.assertions(2)
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.origin.custom.domainName).toEqual('google.com')
    expect(request.origin.custom.protocol).toEqual('https')
  })

  it('does not set the query string value if the "q" value is not defined', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.querystring).toEqual('')
  })

  it('sets the query string value if the "q" value is defined', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/'
    event.Records[0].cf.request.querystring = 'q=pizza'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.querystring).toEqual('q=pizza')
  })

  it('only sets the "q" query string value, ignoring other URL params', () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/'
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza&src=foo'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.querystring).toEqual('q=pizza')
  })
})
