/* eslint-env jest */

import {
  getMockCloudFrontEventObject,
  getMockLambdaContext,
} from '../../utils/lambda-arg-utils'

const callback = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})

describe('newtab app Lambda@Edge function on origin-request', () => {
  it('modifies the path for the /search/ URI', () => {
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/search/index.html')
  })

  it('modifies the path for the /newtab URI', () => {
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/newtab'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/search/index.html')
  })

  it('modifies the path for the /search/profile/stats/ URI', () => {
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/profile/stats/'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/search/index.html')
  })

  it('modifies the path for the /search/profile/stats-thing URI', () => {
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/profile/stats-thing'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/search/index.html')
  })

  it('does not modify the path for the /search/manifest.json URI', () => {
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/manifest.json'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/search/manifest.json')
  })

  it('does not modify the path for the /search/static/my-img.png URI', () => {
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/static/my-img.png'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/search/static/my-img.png')
  })

  it('does not modify the path for the /search/profile/stats/something.txt URI', () => {
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/profile/stats/something.txt'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/search/profile/stats/something.txt')
  })
})
