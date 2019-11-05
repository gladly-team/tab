/* eslint-env jest */

import { handler } from '../handler'

const mockEventObj = { body: JSON.stringify({ some: 'data' }) }

afterEach(() => {
  jest.clearAllMocks()
})

// TODO
describe('Redis Lambda handler', () => {
  it('is a placeholder', async () => {
    expect.assertions(1)
    expect(await handler(mockEventObj)).toEqual({
      statusCode: 200,
      body: JSON.stringify({ just: 'a-test' }),
    })
  })
})
