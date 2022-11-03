/* eslint-env jest */

import {
  getMockCloudFrontResponseEventObject,
  getMockLambdaContext,
} from '../../utils/lambda-arg-utils'

const callback = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('homepage-404-lambda-edge', () => {
  it('sets a 404 response code for the /404 URI', () => {
    const { handler } = require('../homepage-404-lambda-edge')
    const event = getMockCloudFrontResponseEventObject()
    event.Records[0].cf.request.uri = '/404'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.status).toEqual('404')
  })

  it('sets a 404 response code for the /404/ URI', () => {
    const { handler } = require('../homepage-404-lambda-edge')
    const event = getMockCloudFrontResponseEventObject()
    event.Records[0].cf.request.uri = '/404/'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.status).toEqual('404')
  })

  it('sets a 404 response code for the /404.html URI', () => {
    const { handler } = require('../homepage-404-lambda-edge')
    const event = getMockCloudFrontResponseEventObject()
    event.Records[0].cf.request.uri = '/404.html'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.status).toEqual('404')
  })

  it('does not set a 404 response code for the "/" URI', () => {
    const { handler } = require('../homepage-404-lambda-edge')
    const event = getMockCloudFrontResponseEventObject()
    event.Records[0].cf.request.uri = '/'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.status).toEqual('200')
  })

  it('does not set a 404 response code for the "/404/blah/" URI', () => {
    const { handler } = require('../homepage-404-lambda-edge')
    const event = getMockCloudFrontResponseEventObject()
    event.Records[0].cf.request.uri = '/404/blah/'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.status).toEqual('200')
  })

  it('does not set a 404 response code for the "/404-but-not-really" URI', () => {
    const { handler } = require('../homepage-404-lambda-edge')
    const event = getMockCloudFrontResponseEventObject()
    event.Records[0].cf.request.uri = '/404-but-not-really'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.status).toEqual('200')
  })

  it('does not set a 404 response code for the "/cats/" URI', () => {
    const { handler } = require('../homepage-404-lambda-edge')
    const event = getMockCloudFrontResponseEventObject()
    event.Records[0].cf.request.uri = '/cats/'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.status).toEqual('200')
  })

  it('does not set a 404 response code for the "/index.html" URI', () => {
    const { handler } = require('../homepage-404-lambda-edge')
    const event = getMockCloudFrontResponseEventObject()
    event.Records[0].cf.request.uri = '/index.html'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const response = callback.mock.calls[0][1]
    expect(response.status).toEqual('200')
  })
})
