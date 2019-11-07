/* eslint-env jest */

import redis from 'redis'
import { handler } from '../handler'

jest.mock('bluebird')

// Using "Async" methods created by Bluebird.
// Manual mocking because of problems with automock:
// https://github.com/facebook/jest/issues/8983
const mockRedisClient = {
  getAsync: jest.fn(),
  setAsync: jest.fn(),
  incrAsync: jest.fn(),
  quitAsync: jest.fn(),
}

jest.mock('redis', () => ({
  createClient: jest.fn(() => mockRedisClient),
}))

const getMockEventObj = () => ({
  body: JSON.stringify({ operation: 'GET', key: 'foo' }),
})

beforeEach(() => {
  process.env.REDIS_HOST = 'some-fake.host'
  process.env.REDIS_PORT = '6379'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Redis Lambda handler', () => {
  it('connects the client with the expected host and port', async () => {
    expect.assertions(1)
    const eventData = getMockEventObj()
    await handler(eventData)
    expect(redis.createClient).toHaveBeenCalledWith({
      host: 'some-fake.host',
      port: '6379',
    })
  })

  it('returns a 200 error when successful', async () => {
    expect.assertions(1)
    const eventData = getMockEventObj()
    const response = await handler(eventData)
    expect(response).toEqual({
      statusCode: 200,
      body: expect.any(String),
    })
  })

  it('returns a 500 error if body is not provided', async () => {
    expect.assertions(1)
    const eventData = {
      ...getMockEventObj(),
      body: undefined,
    }
    const response = await handler(eventData)
    expect(response).toEqual({
      statusCode: 500,
      body: JSON.stringify({
        message: 'No data provided in the request body.',
      }),
    })
  })

  it('returns a 500 error if body.operation is not provided', async () => {
    expect.assertions(1)
    const eventData = {
      ...getMockEventObj(),
      body: JSON.stringify({
        key: 'foo',
        // missing "operation" property
      }),
    }
    const response = await handler(eventData)
    expect(response).toEqual({
      statusCode: 500,
      body: JSON.stringify({
        message: 'The request body did not include an "operation" value.',
      }),
    })
  })

  it('returns a 500 error if the body.operation is not supported', async () => {
    expect.assertions(1)
    const eventData = {
      ...getMockEventObj(),
      body: JSON.stringify({
        key: 'foo',
        operation: 'EVALSHA', // unsupported Redis operation
      }),
    }
    const response = await handler(eventData)
    expect(response).toEqual({
      statusCode: 500,
      body: JSON.stringify({
        message: 'The provided "operation" value is not supported.',
      }),
    })
  })

  it('quits the client', async () => {
    expect.assertions(1)
    const eventData = getMockEventObj()
    await handler(eventData)
    expect(mockRedisClient.quitAsync).toHaveBeenCalledTimes(1)
  })
})
