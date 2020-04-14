/* eslint-env jest */

import {
  getMockCloudFrontEventObject,
  getMockLambdaContext,
} from '../../utils/lambda-arg-utils'

const callback = jest.fn()

beforeEach(() => {
  process.env.LAMBDA_TAB_V4_HOST = 'example.com'
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('newtab app Lambda@Edge function on origin-request', () => {
  it('modifies the path for the /newtab/ URI', () => {
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/newtab/'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/newtab/index.html')
  })

  it('modifies the path for the /newtab URI', () => {
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/newtab'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/newtab/index.html')
  })

  it('modifies the path for the /newtab/profile/stats/ URI', () => {
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/newtab/profile/stats/'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/newtab/index.html')
  })

  it('modifies the path for the /newtab/profile/stats-thing URI', () => {
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/newtab/profile/stats-thing'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/newtab/index.html')
  })

  it('does not modify the path for the /newtab/manifest.json URI', () => {
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/newtab/manifest.json'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/newtab/manifest.json')
  })

  it('does not modify the path for the /newtab/static/my-img.png URI', () => {
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/newtab/static/my-img.png'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/newtab/static/my-img.png')
  })

  it('does not modify the path for the /newtab/profile/stats/something.txt URI', () => {
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/newtab/profile/stats/something.txt'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/newtab/profile/stats/something.txt')
  })

  it('does not change the origin when there are no cookies passed in request.headers.cookie', () => {
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.headers.cookie = []
    const originalOrigin = event.Records[0].cf.request.origin
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.origin).toMatchObject(originalOrigin)
  })

  it('does not change the origin when there are unrelated cookies passed in request.headers.cookie', () => {
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.headers.cookie = []
    event.Records[0].cf.request.headers.cookie = [
      { key: 'Cookie', value: 'something=here' },
      { key: 'Cookie', value: 'foo=bar' },
    ]
    const originalOrigin = event.Records[0].cf.request.origin
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.origin).toMatchObject(originalOrigin)
  })

  it('changes the origin to ZEIT Now when the v4 beta opt-in cookie is passed in request.headers.cookie', () => {
    process.env.LAMBDA_TAB_V4_HOST = 'my.example.com'
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.headers.cookie = [
      { key: 'Cookie', value: 'something=here' },
      { key: 'Cookie', value: 'tabV4OptIn=enabled' },
    ]
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.origin).toMatchObject({
      custom: {
        domainName: 'my.example.com',
        port: 443,
        protocol: 'https',
        path: '',
        sslProtocols: ['TLSv1', 'TLSv1.1'],
        readTimeout: 10,
        keepaliveTimeout: 10,
        customHeaders: {},
      },
    })
  })

  it('does not change the origin when the v4 beta opt-in cookie is set to something other than "enabled"', () => {
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.headers.cookie = []
    event.Records[0].cf.request.headers.cookie = [
      { key: 'Cookie', value: 'tabV4OptIn=nope' },
    ]
    const originalOrigin = event.Records[0].cf.request.origin
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.origin).toMatchObject(originalOrigin)
  })

  it('changes the request host header to the ZEIT Now origin when the v4 beta opt-in cookie is passed in request.headers.cookie', () => {
    process.env.LAMBDA_TAB_V4_HOST = 'foo.example.com'
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.headers.cookie = [
      { key: 'Cookie', value: 'tabV4OptIn=enabled' },
    ]
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.headers.host).toEqual([
      { key: 'host', value: 'foo.example.com' },
    ])
  })

  it('does not change the request host header to the ZEIT Now origin when the v4 beta opt-in cookie is not passed in request.headers.cookie', () => {
    process.env.LAMBDA_TAB_V4_HOST = 'foo.example.com'
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.headers.cookie = [
      { key: 'Cookie', value: 'blah=hi' },
    ]
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.headers.host).not.toEqual([
      { key: 'host', value: 'foo.example.com' },
    ])
  })

  it('does not modify the request path when using the custom ZEIT Now origin', () => {
    const { handler } = require('../newtab-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.headers.cookie = [
      { key: 'Cookie', value: 'something=here' },
      { key: 'Cookie', value: 'tabV4OptIn=enabled' },
    ]
    event.Records[0].cf.request.uri = '/newtab/'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/newtab/')
  })
})
