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
})
