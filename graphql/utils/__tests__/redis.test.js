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

beforeEach(() => {
  fetch.mockResolvedValue(getMockFetchResponse())
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
})
