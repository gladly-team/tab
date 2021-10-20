/* eslint-env jest */
/* global fetch */
import { mockFetchResponse } from 'js/utils/test-utils'

beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve(mockFetchResponse()))
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('optIntoV4Beta', () => {
  it('calls the expected endpoint', async () => {
    expect.assertions(1)
    const optIntoV4Beta = require('js/utils/v4-beta-opt-in').default
    await optIntoV4Beta()
    expect(fetch.mock.calls[0][0]).toEqual('/newtab/api/beta-opt-in')
  })

  it('calls with the expected data', async () => {
    expect.assertions(1)
    const optIntoV4Beta = require('js/utils/v4-beta-opt-in').default
    await optIntoV4Beta()
    expect(fetch.mock.calls[0][1]).toEqual({
      method: 'POST',
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'X-Gladly-Requested-By': 'tab-web-nextjs',
        'Content-Type': 'application/json',
      }),
      credentials: 'include',
      body: '{"optIn":true}',
    })
  })

  it('calls the expected endpoint', async () => {
    expect.assertions(1)
    const optIntoV4Beta = require('js/utils/v4-beta-opt-in').default
    await optIntoV4Beta()
    expect(fetch.mock.calls[0][0]).toEqual('/newtab/api/beta-opt-in')
  })

  it('throws if the response is not 200', async () => {
    expect.assertions(1)

    // Mock a bad response.
    global.fetch.mockResolvedValue({
      ...mockFetchResponse(),
      ok: false,
      statusText: 'The server messed up.',
    })

    const optIntoV4Beta = require('js/utils/v4-beta-opt-in').default
    await expect(optIntoV4Beta()).rejects.toThrow('The server messed up.')
  })
})
