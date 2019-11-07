/* eslint-env jest */

import fetch from 'node-fetch'
import aws4 from 'aws4'
import logger from '../logger'
import { getMockFetchResponse } from '../../database/test-utils'

jest.mock('node-fetch')
jest.mock('aws4')
jest.mock('../logger')

const getMockInputData = () => ({
  operation: 'GET',
  key: 'foo',
})

beforeAll(() => {
  process.env.REDIS_SERVICE_ENDPOINT = 'https://some.endpoint.example.com/dev'
})

beforeEach(() => {
  fetch.mockResolvedValue(getMockFetchResponse())
  aws4.sign.mockReturnValue({
    host: 'some.endpoint.example.com',
    path: '/dev/redis',
    headers: {
      Host: 'some.endpoint.example.com',
      'X-Amz-Date': '20191224T162032Z',
      Authorization:
        'AWS4-HMAC-SHA256 Credential=ABCDEF/20191224/us-west-2/execute-api/aws4_request, etc.',
    },
  })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Redis outbound', () => {
  it('calls aws4.sign with the expected params', async () => {
    expect.assertions(1)
    const callRedis = require('../redis').default
    const mockInputData = getMockInputData()
    await callRedis(mockInputData)
    expect(aws4.sign).toHaveBeenCalledWith({
      host: 'some.endpoint.example.com',
      path: '/dev/redis',
      method: 'POST',
      body: JSON.stringify(mockInputData),
    })
  })

  it('uses the aws4.sign headers in the fetch request headers', async () => {
    expect.assertions(1)
    const callRedis = require('../redis').default

    const headers = {
      Host: 'some.endpoint.example.com',
      'X-Amz-Date': '20191224T162032Z',
      Authorization:
        'AWS4-HMAC-SHA256 Credential=ABCDEF/20191224/us-west-2/execute-api/aws4_request, etc.',
    }
    aws4.sign.mockReturnValue({
      host: 'some.endpoint.example.com',
      path: '/dev/redis',
      headers,
    })
    const mockInputData = getMockInputData()
    await callRedis(mockInputData)
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      body: expect.any(String),
      method: 'POST',
      headers,
    })
  })

  it('calls the expected endpoint via fetch', async () => {
    expect.assertions(1)
    const callRedis = require('../redis').default
    const mockInputData = getMockInputData()
    await callRedis(mockInputData)
    expect(fetch).toHaveBeenCalledWith(
      'https://some.endpoint.example.com/dev/redis',
      expect.any(Object)
    )
  })

  it('returns string data provided by the Redis service', async () => {
    expect.assertions(1)
    const callRedis = require('../redis').default
    const mockInputData = getMockInputData()
    fetch.mockResolvedValue({
      ...getMockFetchResponse(),
      ok: true,
      json: () =>
        Promise.resolve({
          data: 'this-is-the-fetched-redis-value',
        }),
    })
    const returnVal = await callRedis(mockInputData)
    expect(returnVal).toEqual('this-is-the-fetched-redis-value')
  })

  it('returns object data provided by the Redis service', async () => {
    expect.assertions(1)
    const callRedis = require('../redis').default
    const mockInputData = getMockInputData()
    fetch.mockResolvedValue({
      ...getMockFetchResponse(),
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            redisReturned: 'anObject',
            so: 'hereYouGo',
          },
        }),
    })
    const returnVal = await callRedis(mockInputData)
    expect(returnVal).toEqual({
      redisReturned: 'anObject',
      so: 'hereYouGo',
    })
  })

  it('logs an error and throws if the Redis service returns an error', async () => {
    expect.assertions(2)
    const callRedis = require('../redis').default
    const mockInputData = getMockInputData()
    fetch.mockResolvedValue({
      ...getMockFetchResponse(),
      ok: false,
      status: 400,
      json: () =>
        Promise.resolve({
          code: 'SOME_ERROR',
          message: 'Some error happened.',
        }),
    })
    await expect(callRedis(mockInputData)).rejects.toThrow(
      'Bad request data sent to the Redis service: Some error happened.'
    )
    expect(logger.error).toHaveBeenCalledWith(
      new Error(
        'Bad request data sent to the Redis service: Some error happened.'
      )
    )
  })

  it('logs an error and throws if the something goes wrong when calling Redis', async () => {
    expect.assertions(2)
    const callRedis = require('../redis').default

    // Mock some unexpected error.
    aws4.sign.mockImplementation(() => {
      throw new Error('You did it wrong.')
    })

    const mockInputData = getMockInputData()
    await expect(callRedis(mockInputData)).rejects.toThrow('You did it wrong.')
    expect(logger.error).toHaveBeenCalledWith(new Error('You did it wrong.'))
  })
})
