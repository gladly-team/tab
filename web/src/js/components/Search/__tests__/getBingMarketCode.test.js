/* eslint-env jest */

import { getCountry } from 'js/utils/client-location'

jest.mock('js/utils/client-location')

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
  it('returns the expected mkt when we know the country and 2-character language preference', async () => {
    expect.assertions(1)

    // Belgium
    getCountry.mockImplementation(() => Promise.resolve('BE'))

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
    expect(mkt).toEqual('fr-BE')
  })

  it('returns the expected mkt when we know the country and 5-character language preference', async () => {
    expect.assertions(2)

    // Set to U.S.; we should not use this when the language setting
    // already defines the country/region.
    getCountry.mockImplementation(() => Promise.resolve('US'))

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
    expect(getCountry).not.toHaveBeenCalled()
  })

  it('returns null when we know the language but not the country', async () => {
    expect.assertions(1)

    getCountry.mockImplementation(() => Promise.resolve(null))
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

  it('returns null when getting the country code throws an error', async () => {
    expect.assertions(1)

    getCountry.mockImplementation(() => {
      throw new Error('eeeee!')
    })
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

  it('returns null when we know the country but not the language', async () => {
    expect.assertions(1)

    getCountry.mockImplementation(() => Promise.resolve('FR'))
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

    getCountry.mockImplementation(() => Promise.resolve('MX'))
    Object.defineProperty(window.navigator, 'languages', {
      value: ['es'],
      configurable: true,
      writable: true,
    })
    Object.defineProperty(window.navigator, 'language', {
      value: 'en',
      configurable: true,
      writable: true,
    })

    const getBingMarketCode = require('js/components/Search/getBingMarketCode')
      .default
    const mkt = await getBingMarketCode()
    expect(mkt).toEqual('es-MX')
  })
})
