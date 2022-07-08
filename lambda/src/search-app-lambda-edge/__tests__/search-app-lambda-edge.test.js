/* eslint-env jest */

import AWS from 'aws-sdk'
import { clone } from 'lodash/lang'
import { setWith } from 'lodash/object'
import { getMockCloudFrontEventObject } from '../../utils/lambda-arg-utils'
import searchURLByRegion from '../searchURLByRegion'

jest.mock('aws-sdk', () => {
  const mockSNS = {
    publish: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  }
  return { SNS: jest.fn(() => mockSNS) }
})

jest.mock('../searchURLByRegion')

const MOCK_V2_SEARCH_URL =
  'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001'

beforeEach(() => {
  process.env.AWS_REGION = 'ca-central-1'
  searchURLByRegion.mockReturnValue(MOCK_V2_SEARCH_URL)
})

afterEach(() => {
  jest.clearAllMocks()
})

const searchPathProduction = '/search/'
const searchV1Path = '/search/v1'
const searchV2Path = '/search/v2'
const searchV3Path = '/search/v3'
const setEventURI = (event, uri) => {
  // Like `set` but immutable:
  // https://github.com/lodash/lodash/issues/1696#issuecomment-328335502
  return setWith(clone(event), 'Records[0].cf.request.uri', uri, clone)
}

const setXTabStageHeaderVal = (event, newValue) => {
  return setWith(
    clone(event),
    'Records[0].cf.request.origin.custom.customHeaders["x-tab-stage"][0].value',
    newValue,
    clone
  )
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

describe('prod behavior: search app Lambda@Edge function on viewer-request', () => {
  it('redirects with a 307 redirect', async () => {
    expect.assertions(2)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchPathProduction)
    const response = await handler(event)
    expect(response.status).toEqual('307')
    expect(response.statusDescription).toEqual('Found')
  })

  it('redirects an empty search to Google without a query string', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchPathProduction)
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search'
    )
  })

  it('sets the query string value if the "q" value is defined', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchPathProduction)
    event.Records[0].cf.request.querystring = 'q=pizza'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza'
    )
  })

  it('sets the query string value if the "q" value is defined with a space character', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchPathProduction)
    event.Records[0].cf.request.querystring = 'q=pizza+palace'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza+palace'
    )
  })

  it('sets the query string value if the "q" value is defined with a special character', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchPathProduction)
    event.Records[0].cf.request.querystring = 'q=pizza🍕'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza%F0%9F%8D%95'
    )
  })

  it('only sets the "q" query string value, ignoring other URL params', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchPathProduction)
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza'
    )
  })
})

describe('v1: search app Lambda@Edge function on viewer-request', () => {
  it('redirects with a 307 redirect', async () => {
    expect.assertions(2)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV1Path)
    const response = await handler(event)
    expect(response.status).toEqual('307')
    expect(response.statusDescription).toEqual('Found')
  })

  it('redirects an empty search to Google without a query string', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV1Path)
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search'
    )
  })

  it('sets the query string value if the "q" value is defined', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV1Path)
    event.Records[0].cf.request.querystring = 'q=pizza'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza'
    )
  })

  it('sets the query string value if the "q" value is defined with a space character', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV1Path)
    event.Records[0].cf.request.querystring = 'q=pizza+palace'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza+palace'
    )
  })

  it('sets the query string value if the "q" value is defined with a special character', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV1Path)
    event.Records[0].cf.request.querystring = 'q=pizza🍕'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza%F0%9F%8D%95'
    )
  })

  it('only sets the "q" query string value, ignoring other URL params', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV1Path)
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://www.google.com/search?q=pizza'
    )
  })
})

describe('v2: search app Lambda@Edge function on viewer-request', () => {
  it('redirects with a 307 redirect', async () => {
    expect.assertions(2)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    const response = await handler(event)
    expect(response.status).toEqual('307')
    expect(response.statusDescription).toEqual('Found')
  })

  it('redirects an empty search to Yahoo without a query string', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none'
    )
  })

  it('uses the v2 API if the URI has a trailing slash', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, '/search/v2/')
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none'
    )
  })

  it('sets the query string value if the "q" value is defined', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring = 'q=pizza'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none&p=pizza'
    )
  })

  it('sets the query string value if the "q" value is defined with a space character', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring = 'q=pizza+palace'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none&p=pizza+palace'
    )
  })

  it('sets the query string value if the "q" value is defined with a special character', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring = 'q=pizza🍕'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none&p=pizza%F0%9F%8D%95'
    )
  })

  it('only sets the "q" query string value, ignoring other unused URL params', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza&blah=foo'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none&p=pizza'
    )
  })

  it('sets the "type" string with an empty cause ID, source of search, and referral ID', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none&p=pizza'
    )
  })

  it('sets the "type" string with a source', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza&src=tab'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_tab.c_none.r_none&p=pizza'
    )
  })

  it('sets the "type" string with a cause ID', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring = 'hi=there&c=abc123&q=pizza'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_abc123.r_none&p=pizza'
    )
  })

  it('sets the "type" string with a referral ID', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring = 'hi=there&r=2468&q=pizza'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_2468&p=pizza'
    )
  })

  it('sets the "type" string with all fields', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring =
      'hi=there&r=2468&q=pizza&c=someCauseId&src=ff'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_ff.c_someCauseId.r_2468&p=pizza'
    )
  })

  it('passes the expected header values to `searchURLByRegion`', async () => {
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
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza'
    await handler(event)
    expect(searchURLByRegion).toHaveBeenCalledWith('MX', 'es')
  })

  it('does not call SNS', async () => {
    expect.assertions(2)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV2Path)
    event.Records[0].cf.request.querystring =
      'hi=there&r=2468&q=pizza&c=someCauseId&src=ff'
    await handler(event)
    const sns = new AWS.SNS()
    expect(sns.publish).not.toHaveBeenCalled()
    expect(sns.publish().promise).not.toHaveBeenCalled()
  })
})

// Cloned and modified v2 tests, so we can just delete prior version tests
// when we no longer support the behavior.
describe('v3: search app Lambda@Edge function on viewer-request', () => {
  it('redirects with a 307 redirect', async () => {
    expect.assertions(2)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV3Path)
    const response = await handler(event)
    expect(response.status).toEqual('307')
    expect(response.statusDescription).toEqual('Found')
  })

  it('redirects an empty search to Yahoo without a query string', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV3Path)
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none'
    )
  })

  it('uses the v2 API if the URI has a trailing slash', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, '/search/v2/')
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none'
    )
  })

  it('sets the query string value if the "q" value is defined', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV3Path)
    event.Records[0].cf.request.querystring = 'q=pizza'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none&p=pizza'
    )
  })

  it('sets the query string value if the "q" value is defined with a space character', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV3Path)
    event.Records[0].cf.request.querystring = 'q=pizza+palace'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none&p=pizza+palace'
    )
  })

  it('sets the query string value if the "q" value is defined with a special character', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV3Path)
    event.Records[0].cf.request.querystring = 'q=pizza🍕'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none&p=pizza%F0%9F%8D%95'
    )
  })

  it('only sets the "q" query string value, ignoring other unused URL params', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV3Path)
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza&blah=foo'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none&p=pizza'
    )
  })

  it('sets the "type" string with an empty cause ID, source of search, and referral ID', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV3Path)
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_none&p=pizza'
    )
  })

  it('sets the "type" string with a source', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV3Path)
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza&src=tab'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_tab.c_none.r_none&p=pizza'
    )
  })

  it('sets the "type" string with a cause ID', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV3Path)
    event.Records[0].cf.request.querystring = 'hi=there&c=abc123&q=pizza'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_abc123.r_none&p=pizza'
    )
  })

  it('sets the "type" string with a referral ID', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV3Path)
    event.Records[0].cf.request.querystring = 'hi=there&r=2468&q=pizza'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_none.c_none.r_2468&p=pizza'
    )
  })

  it('sets the "type" string with all fields', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV3Path)
    event.Records[0].cf.request.querystring =
      'hi=there&r=2468&q=pizza&c=someCauseId&src=ff'
    const response = await handler(event)
    expect(response.headers.location[0].value).toEqual(
      'https://search.yahoo.com/yhs/search?hspart=gladly&hsimp=yhs-001&type=src_ff.c_someCauseId.r_2468&p=pizza'
    )
  })

  it('passes the expected header values to `searchURLByRegion`', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setHeader(
      setHeader(
        setEventURI(defaultEvent, searchV3Path),
        'cloudfront-viewer-country',
        'MX'
      ),
      'accept-language',
      'es'
    )
    event.Records[0].cf.request.querystring = 'hi=there&q=pizza'
    await handler(event)
    expect(searchURLByRegion).toHaveBeenCalledWith('MX', 'es')
  })

  it('publishes to SNS once', async () => {
    expect.assertions(2)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV3Path)
    event.Records[0].cf.request.querystring =
      'hi=there&r=2468&q=pizza&c=someCauseId&src=ff'
    await handler(event)
    const sns = new AWS.SNS()
    expect(sns.publish).toHaveBeenCalledTimes(1)
    expect(sns.publish().promise).toHaveBeenCalledTimes(1)
  })

  it('publishes to SNS with the expected message', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setEventURI(defaultEvent, searchV3Path)
    event.Records[0].cf.request.querystring =
      'hi=there&r=2468&q=pizza&c=someCauseId&src=ff'
    await handler(event)
    const sns = new AWS.SNS()
    const expectedMessage = JSON.stringify({
      user: {
        idToken: null,
      },
      data: {
        src: 'ff',
        engine: 'SearchForACause',
        causeId: 'someCauseId',
      },
    })
    const input = sns.publish.mock.calls[0][0]
    expect(input.Message).toEqual(expectedMessage)
  })

  it('publishes to SNS with the expected topic ARN on non-prod (no header set)', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()

    // Don't set the X-Tab-Stage header.
    const event = setEventURI(defaultEvent, searchV3Path)

    event.Records[0].cf.request.querystring =
      'hi=there&r=2468&q=pizza&c=someCauseId&src=ff'
    await handler(event)
    const sns = new AWS.SNS()
    const input = sns.publish.mock.calls[0][0]
    expect(input).toMatchObject({
      Message: expect.any(String),
      TopicArn: 'arn:aws:sns:ca-central-1:167811431063:dev-SearchRequest',
    })
  })

  it('publishes to SNS with the expected topic ARN on non-prod', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setXTabStageHeaderVal(
      setEventURI(defaultEvent, searchV3Path),
      'dev'
    )
    event.Records[0].cf.request.querystring =
      'hi=there&r=2468&q=pizza&c=someCauseId&src=ff'
    await handler(event)
    const sns = new AWS.SNS()
    const input = sns.publish.mock.calls[0][0]
    expect(input).toMatchObject({
      Message: expect.any(String),
      TopicArn: 'arn:aws:sns:ca-central-1:167811431063:dev-SearchRequest',
    })
  })

  it('publishes to SNS with the expected topic ARN on prod', async () => {
    expect.assertions(1)
    const { handler } = require('../search-app-lambda-edge')
    const defaultEvent = getMockCloudFrontEventObject()
    const event = setXTabStageHeaderVal(
      setEventURI(defaultEvent, searchV3Path),
      'prod'
    )
    event.Records[0].cf.request.querystring =
      'hi=there&r=2468&q=pizza&c=someCauseId&src=ff'
    await handler(event)
    const sns = new AWS.SNS()
    const input = sns.publish.mock.calls[0][0]
    expect(input).toMatchObject({
      Message: expect.any(String),
      TopicArn: 'arn:aws:sns:ca-central-1:167811431063:SearchRequest',
    })
  })
})
