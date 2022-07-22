/* eslint-env jest */

import fetch from 'node-fetch'
import { getMockSNSEventObject } from '../../utils/lambda-arg-utils'

jest.mock('node-fetch')
process.env.GRAPHQL_ENDPOINT = 'http://localhost:8080/graphql/'

beforeEach(() => {
  jest.clearAllMocks()
})

const getMockSNSMessagePayload = () => {
  return {
    user: {
      idToken: 'abcdToken', // Firebase ID token, unverified
    },
    data: {
      src: 'ff', // search source
      engine: 'SearchForACause', // search engine ID
      causeId: 'CA6A5C2uj',
    },
  }
}

const setSNSEventMessage = (event, message) => {
  const newRecords = event.Records.map(rec => {
    return {
      ...rec,
      Sns: {
        ...rec.Sns,
        Message: message,
      },
    }
  })
  return {
    ...event,
    Records: newRecords,
  }
}

describe('Search request logger', () => {
  it('calls graphql endpoint with the correct message', async () => {
    expect.assertions(1)
    fetch.mockResolvedValue({
      body: {},
      bodyUsed: true,
      headers: {},
      json: () => Promise.resolve({ success: true }),
      ok: true,
      redirected: false,
      status: 200,
      statusText: '',
      type: 'cors',
      url: 'https://example.com/foo/',
    })

    const payload = getMockSNSMessagePayload()
    const mockEvent = setSNSEventMessage(
      getMockSNSEventObject(),
      JSON.stringify(payload)
    )
    const { handler } = require('../search-request-logger.mjs')
    await handler(mockEvent)

    // eslint-disable-next-line no-console
    expect(fetch).toHaveBeenLastCalledWith(process.env.GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: payload.user.idToken,
      },
      body: JSON.stringify({
        query: `mutation LogSearchMutation($input: LogSearchInput!) {
        logSearch(input: $input) {
          success
        }
      }`,
        variables: {
          input: {
            causeId: payload.data.causeId,
            searchEngineId: payload.data.engine,
            version: 2,
            source: payload.data.src,
          },
        },
        operationName: 'LogSearchMutation',
      }),
    })
  })

  it('calls graphql endpoint with unauthenticated Authorization header', async () => {
    expect.assertions(1)
    fetch.mockResolvedValue({
      body: {},
      bodyUsed: true,
      headers: {},
      json: () => Promise.resolve({ success: true }),
      ok: true,
      redirected: false,
      status: 200,
      statusText: '',
      type: 'cors',
      url: 'https://example.com/foo/',
    })
    const payload = getMockSNSMessagePayload()
    delete payload.user.idToken
    const mockEvent = setSNSEventMessage(
      getMockSNSEventObject(),
      JSON.stringify(payload)
    )
    const { handler } = require('../search-request-logger.mjs')
    await handler(mockEvent)

    // eslint-disable-next-line no-console
    expect(fetch).toHaveBeenLastCalledWith(process.env.GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'unauthenticated',
      },
      body: JSON.stringify({
        query: `mutation LogSearchMutation($input: LogSearchInput!) {
        logSearch(input: $input) {
          success
        }
      }`,
        variables: {
          input: {
            causeId: payload.data.causeId,
            searchEngineId: payload.data.engine,
            version: 2,
            source: payload.data.src,
          },
        },
        operationName: 'LogSearchMutation',
      }),
    })
  })

  it('returns the expected value', async () => {
    expect.assertions(1)
    fetch.mockResolvedValue({
      body: {},
      bodyUsed: true,
      headers: {},
      json: () => Promise.resolve({ success: true }),
      ok: true,
      redirected: false,
      status: 200,
      statusText: '',
      type: 'cors',
      url: 'https://example.com/foo/',
    })
    const payload = JSON.stringify(getMockSNSMessagePayload())
    jest.spyOn(console, 'log').mockImplementationOnce(() => {})
    const mockEvent = setSNSEventMessage(getMockSNSEventObject(), payload)
    const { handler } = require('../search-request-logger.mjs')
    const response = await handler(mockEvent)
    expect(response).toEqual({ success: true })
  })

  it('passes stringified authUserTokens and authUserTokensSig headers correctly if applicable', async () => {
    expect.assertions(1)
    fetch.mockResolvedValue({
      body: {},
      bodyUsed: true,
      headers: {},
      json: () => Promise.resolve({ success: true }),
      ok: true,
      redirected: false,
      status: 200,
      statusText: '',
      type: 'cors',
      url: 'https://example.com/foo/',
    })
    const payload = {
      ...getMockSNSMessagePayload(),
      user: {
        authUserTokens: 'test-auth-user-tokens',
        authUserTokensSig: 'test-auth-user-tokens-sig',
      },
    }
    const mockEvent = setSNSEventMessage(
      getMockSNSEventObject(),
      JSON.stringify(payload)
    )
    const { handler } = require('../search-request-logger.mjs')
    await handler(mockEvent)

    // eslint-disable-next-line no-console
    expect(fetch).toHaveBeenLastCalledWith(process.env.GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: JSON.stringify({
          tabAuthUserTokens: payload.user.authUserTokens,
          tabAuthUserTokensSig: payload.user.authUserTokensSig,
        }),
      },
      body: JSON.stringify({
        query: `mutation LogSearchMutation($input: LogSearchInput!) {
        logSearch(input: $input) {
          success
        }
      }`,
        variables: {
          input: {
            causeId: payload.data.causeId,
            searchEngineId: payload.data.engine,
            version: 2,
            source: payload.data.src,
          },
        },
        operationName: 'LogSearchMutation',
      }),
    })
  })

  it('prefers idToken over authUserTokens and authUserTokensSig headers correctly if applicable', async () => {
    expect.assertions(1)
    fetch.mockResolvedValue({
      body: {},
      bodyUsed: true,
      headers: {},
      json: () => Promise.resolve({ success: true }),
      ok: true,
      redirected: false,
      status: 200,
      statusText: '',
      type: 'cors',
      url: 'https://example.com/foo/',
    })
    const payload = {
      ...getMockSNSMessagePayload(),
      user: {
        idToken: 'abcdToken',
        authUserTokens: 'test-auth-user-tokens',
        authUserTokensSig: 'test-auth-user-tokens-sig',
      },
    }
    const mockEvent = setSNSEventMessage(
      getMockSNSEventObject(),
      JSON.stringify(payload)
    )
    const { handler } = require('../search-request-logger.mjs')
    await handler(mockEvent)

    // eslint-disable-next-line no-console
    expect(fetch).toHaveBeenLastCalledWith(process.env.GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: payload.user.idToken,
      },
      body: JSON.stringify({
        query: `mutation LogSearchMutation($input: LogSearchInput!) {
        logSearch(input: $input) {
          success
        }
      }`,
        variables: {
          input: {
            causeId: payload.data.causeId,
            searchEngineId: payload.data.engine,
            version: 2,
            source: payload.data.src,
          },
        },
        operationName: 'LogSearchMutation',
      }),
    })
  })
})
