/* eslint-env jest */

jest.mock('js/utils/client-location')

afterEach(() => {
  jest.clearAllMocks()
})

describe('getBingMarketCode', () => {
  it('returns en-US', async () => {
    expect.assertions(1)
    const getBingMarketCode = require('js/components/Search/getBingMarketCode')
      .default
    const mkt = await getBingMarketCode()
    expect(mkt).toEqual('en-US')
  })
})
