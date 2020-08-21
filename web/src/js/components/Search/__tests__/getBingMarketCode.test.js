/* eslint-env jest */

beforeEach(() => {
  Object.defineProperty(window.navigator, 'languages', {
    value: ['es-MX', 'en'],
    configurable: true,
    writable: true,
  })
  Object.defineProperty(window.navigator, 'language', {
    value: 'es-MX',
    configurable: true,
    writable: true,
  })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('getBingMarketCode', () => {
  it('returns null when we only know the 2-character language preference', async () => {
    expect.assertions(1)

    // French
    Object.defineProperty(window.navigator, 'languages', {
      value: ['fr'],
      configurable: true,
      writable: true,
    })
    Object.defineProperty(window.navigator, 'language', {
      value: 'fr',
      configurable: true,
      writable: true,
    })

    const getBingMarketCode = require('js/components/Search/getBingMarketCode')
      .default
    const mkt = await getBingMarketCode()
    expect(mkt).toBeNull()
  })

  it('returns the expected mkt when we know the 5-character language preference', async () => {
    expect.assertions(1)

    Object.defineProperty(window.navigator, 'languages', {
      value: ['es-ES'],
      configurable: true,
      writable: true,
    })
    Object.defineProperty(window.navigator, 'language', {
      value: 'es-ES',
      configurable: true,
      writable: true,
    })

    const getBingMarketCode = require('js/components/Search/getBingMarketCode')
      .default
    const mkt = await getBingMarketCode()
    expect(mkt).toEqual('es-ES')
  })

  it('returns null when we know the language but not the country', async () => {
    expect.assertions(1)

    Object.defineProperty(window.navigator, 'languages', {
      value: ['fr'],
      configurable: true,
      writable: true,
    })
    Object.defineProperty(window.navigator, 'language', {
      value: 'fr',
      configurable: true,
      writable: true,
    })

    const getBingMarketCode = require('js/components/Search/getBingMarketCode')
      .default
    const mkt = await getBingMarketCode()
    expect(mkt).toBeNull()
  })

  it("returns null when we don't know the language", async () => {
    expect.assertions(1)

    Object.defineProperty(window.navigator, 'languages', {
      value: [],
      configurable: true,
      writable: true,
    })
    Object.defineProperty(window.navigator, 'language', {
      value: undefined,
      configurable: true,
      writable: true,
    })

    const getBingMarketCode = require('js/components/Search/getBingMarketCode')
      .default
    const mkt = await getBingMarketCode()
    expect(mkt).toBeNull()
  })

  it('prioritizes the top language preference from navigator.languages over navigator.language', async () => {
    expect.assertions(1)

    Object.defineProperty(window.navigator, 'languages', {
      value: ['es-MX'],
      configurable: true,
      writable: true,
    })
    Object.defineProperty(window.navigator, 'language', {
      value: 'en-US',
      configurable: true,
      writable: true,
    })

    const getBingMarketCode = require('js/components/Search/getBingMarketCode')
      .default
    const mkt = await getBingMarketCode()
    expect(mkt).toEqual('es-MX')
  })
})
