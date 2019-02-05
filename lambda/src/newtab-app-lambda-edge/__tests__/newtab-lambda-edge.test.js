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
})
