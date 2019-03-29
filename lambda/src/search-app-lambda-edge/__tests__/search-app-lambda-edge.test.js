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

  it('modifies the path for the /search/ URI with a query string', () => {
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/?q=foobar&src=chrome'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/search/index.html')
  })

  // In the future, we may want to change this to pre-render
  // additional pages.
  it('sends a non-search-page path, /search/foo/?q=blah, to 200.html', () => {
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/foo/?q=blah'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/search/200.html')
  })

  it('sends a non-search-page path, /search/profile/stats/, to 200.html', () => {
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/profile/stats/'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/search/200.html')
  })

  it('sends a non-search-page path, /search/profile/stats-thing, to 200.html', () => {
    const { handler } = require('../search-app-lambda-edge')
    const event = getMockCloudFrontEventObject()
    event.Records[0].cf.request.uri = '/search/profile/stats-thing'
    const context = getMockLambdaContext()
    handler(event, context, callback)
    const request = callback.mock.calls[0][1]
    expect(request.uri).toEqual('/search/200.html')
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
