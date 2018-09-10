/* eslint-env jest */

import moment from 'moment'
import MockDate from 'mockdate'
import {
  STORAGE_LOCATION_COUNTRY_ISO_CODE,
  STORAGE_LOCATION_IS_IN_EU,
  STORAGE_LOCATION_QUERY_TIME
} from '../../constants'
import { isNil } from 'lodash/lang'

jest.mock('../localstorage-mgr')
jest.mock('utils/logger')

const mockNow = '2018-05-15T10:30:00.000'

const getMockMaxMindResponse = (
  countryIsoCode = 'US',
  isInEuropeanUnion = null,
  continentIsoCode = 'NA'
) => ({
  continent: {
    code: continentIsoCode,
    geoname_id: 12345678,
    names: {
      en: 'North America'
    }
  },
  country: {
    iso_code: countryIsoCode,
    geoname_id: 24681012,
    names: {
      en: 'United States'
    },
    ...(!isNil(isInEuropeanUnion) && {is_in_european_union: isInEuropeanUnion})
  },
  registered_country: {
    iso_code: countryIsoCode,
    geoname_id: 24681012,
    names: {
      en: 'United States'
    },
    ...(!isNil(isInEuropeanUnion) && {is_in_european_union: isInEuropeanUnion})
  },
  traits: {
    ip_address: '73.xxx.xxx.x'
  }
})

const mockGeoIP = {
  country: jest.fn((successCallback, failureCallback) => successCallback(getMockMaxMindResponse()))
}

beforeAll(() => {
  MockDate.set(moment(mockNow))
  window.geoip2 = mockGeoIP
})

afterEach(() => {
  const __mockClear = require('../localstorage-mgr').__mockClear
  __mockClear()
  jest.clearAllMocks()

  // Because client-location.js stores location in memory
  jest.resetModules()
})

afterAll(() => {
  MockDate.reset()
  delete window.geoip2
})

describe('client-location', () => {
  it('calls MaxMind when location is not in localStorage or memory', async () => {
    expect.assertions(2)
    const getCountry = require('../client-location').getCountry
    const returnedVal = await getCountry()
    expect(returnedVal).toBe('US')
    expect(mockGeoIP.country).toHaveBeenCalled()
  })

  it('does not call MaxMind when the location is in localStorage', async () => {
    expect.assertions(2)

    // Location exists in localStorage
    const localStorageMgr = require('../localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'DE')
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'true')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, moment().utc().toISOString())

    const getCountry = require('../client-location').getCountry
    const returnedVal = await getCountry()
    expect(returnedVal).toBe('DE')
    expect(mockGeoIP.country).not.toHaveBeenCalled()
  })

  it('calls MaxMind when the location is in localStorage but has expired', async () => {
    expect.assertions(2)

    // Location exists in localStorage but is expired
    const localStorageMgr = require('../localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'CA') // out-of-date location
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'false')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, '2018-02-10T09:00:00.000') // expired

    const getCountry = require('../client-location').getCountry
    const returnedVal = await getCountry()
    expect(returnedVal).toBe('US')
    expect(mockGeoIP.country).toHaveBeenCalledTimes(1)
  })

  it('does not call MaxMind when the location is in localStorage and has not quite expired', async () => {
    expect.assertions(2)

    // Location exists in localStorage
    const localStorageMgr = require('../localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'CA')
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'false')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, '2018-04-21T09:00:00.000') // not yet expired

    const getCountry = require('../client-location').getCountry
    const returnedVal = await getCountry()
    expect(returnedVal).toBe('CA')
    expect(mockGeoIP.country).not.toHaveBeenCalled()
  })

  it('calls MaxMind when the location is in localStorage but is missing some data', async () => {
    expect.assertions(1)

    // Location exists in localStorage but we're missing the "isInEuropeanUnion" key
    const localStorageMgr = require('../localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'DE')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, moment().utc().toISOString())

    const getCountry = require('../client-location').getCountry
    await getCountry()
    expect(mockGeoIP.country).toHaveBeenCalledTimes(1)
  })

  it('stores the location result in localStorage after calling MaxMind', async () => {
    expect.assertions(3)
    const getCountry = require('../client-location').getCountry
    await getCountry()

    // Check that localStorage has the correct values
    const localStorageMgr = require('../localstorage-mgr').default
    expect(
      localStorageMgr.getItem(STORAGE_LOCATION_COUNTRY_ISO_CODE)
    ).toBe('US')
    expect(
      localStorageMgr.getItem(STORAGE_LOCATION_IS_IN_EU)
    ).toBe('false')
    expect(
      localStorageMgr.getItem(STORAGE_LOCATION_QUERY_TIME)
    ).toBe(moment.utc().toISOString())
  })

  it('stores the location result in localStorage after calling MaxMind (EU country variant)', async () => {
    expect.assertions(3)
    mockGeoIP.country.mockImplementationOnce((successCallback, failureCallback) => {
      // Mock that MaxMind says the location is Germany
      return successCallback(getMockMaxMindResponse('DE', true))
    })
    const getCountry = require('../client-location').getCountry
    await getCountry()

    // Check that localStorage has the correct values
    const localStorageMgr = require('../localstorage-mgr').default
    expect(
      localStorageMgr.getItem(STORAGE_LOCATION_COUNTRY_ISO_CODE)
    ).toBe('DE')
    expect(
      localStorageMgr.getItem(STORAGE_LOCATION_IS_IN_EU)
    ).toBe('true')
    expect(
      localStorageMgr.getItem(STORAGE_LOCATION_QUERY_TIME)
    ).toBe(moment.utc().toISOString())
  })

  it('does not set localStorage when having fetched from localStorage (i.e., no call to MaxMind)', async () => {
    expect.assertions(1)

    // Location exists in localStorage
    const localStorageMgr = require('../localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'DE')
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'true')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, moment().utc().toISOString())
    jest.clearAllMocks()

    const getCountry = require('../client-location').getCountry
    await getCountry()

    expect(localStorageMgr.setItem).not.toHaveBeenCalled()
  })

  it('only calls MaxMind once, even with multiple simultaneous location calls', async () => {
    expect.assertions(1)
    const getCountry = require('../client-location').getCountry
    getCountry()
    getCountry()
    await getCountry()
    expect(mockGeoIP.country).toHaveBeenCalledTimes(1)
  })

  it('does not call MaxMind more then once, because the location should be in memory', async () => {
    expect.assertions(2)
    const getCountry = require('../client-location').getCountry
    await getCountry()
    expect(mockGeoIP.country).toHaveBeenCalledTimes(1)
    jest.clearAllMocks()
    await getCountry()
    expect(mockGeoIP.country).not.toHaveBeenCalled()
  })

  it('does not call localStorage more then once, because the location should be in memory', async () => {
    expect.assertions(2)

    // Location exists in localStorage
    const localStorageMgr = require('../localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'DE')
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'true')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, moment().utc().toISOString())

    const getCountry = require('../client-location').getCountry
    await getCountry()
    expect(localStorageMgr.getItem).toHaveBeenCalled()
    jest.clearAllMocks()
    await getCountry()
    expect(localStorageMgr.getItem).not.toHaveBeenCalled()
  })

  it('returns expected value for isInEuropeanUnion when it is false (via MaxMind)', async () => {
    expect.assertions(1)
    const isInEuropeanUnion = require('../client-location').isInEuropeanUnion
    const returnedVal = await isInEuropeanUnion()
    expect(returnedVal).toBe(false)
  })

  it('returns expected value for isInEuropeanUnion when it is true (via MaxMind)', async () => {
    expect.assertions(1)
    mockGeoIP.country.mockImplementationOnce((successCallback, failureCallback) => {
      // Mock that MaxMind says the location is Germany
      return successCallback(getMockMaxMindResponse('DE', true))
    })
    const isInEuropeanUnion = require('../client-location').isInEuropeanUnion
    const returnedVal = await isInEuropeanUnion()
    expect(returnedVal).toBe(true)
  })

  it('returns expected value for isInEuropeanUnion when it is false (via localStorage)', async () => {
    expect.assertions(1)

    // Location exists in localStorage
    const localStorageMgr = require('../localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'DE')
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'false')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, moment().utc().toISOString())

    const isInEuropeanUnion = require('../client-location').isInEuropeanUnion
    const returnedVal = await isInEuropeanUnion()
    expect(returnedVal).toBe(false)
  })

  it('returns expected value for isInEuropeanUnion when it is true (via localStorage)', async () => {
    expect.assertions(1)

    // Location exists in localStorage
    const localStorageMgr = require('../localstorage-mgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'DE')
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'true')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, moment().utc().toISOString())

    const isInEuropeanUnion = require('../client-location').isInEuropeanUnion
    const returnedVal = await isInEuropeanUnion()
    expect(returnedVal).toBe(true)
  })

  it('throws an error if MaxMind returns an error when trying to get country code', async () => {
    expect.assertions(1)

    // Suppress expected console error
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    // Mock a MaxMind error
    mockGeoIP.country.mockImplementationOnce((successCallback, failureCallback) => {
      return failureCallback({ code: 'BAD_THING_HAPPENED' })
    })

    const getCountry = require('../client-location').getCountry
    await expect(getCountry()).rejects.toThrow('Could not determine client location country')
  })

  it('throws an error if MaxMind returns an error when trying to get EU membership status', async () => {
    expect.assertions(1)

    // Suppress expected console error
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    // Mock a MaxMind error
    mockGeoIP.country.mockImplementationOnce((successCallback, failureCallback) => {
      return failureCallback({ code: 'BAD_THING_HAPPENED' })
    })

    const isInEuropeanUnion = require('../client-location').isInEuropeanUnion
    await expect(isInEuropeanUnion()).rejects.toThrow('Could not determine client location EU membership')
  })

  it('does not log an error for a typical MaxMind error', async () => {
    expect.assertions(1)
    const logger = require('utils/logger').default

    // Suppress expected console error
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    // Mock a MaxMind error
    mockGeoIP.country.mockImplementationOnce((successCallback, failureCallback) => {
      return failureCallback({ code: 'HTTP_TIMEOUT' })
    })

    const getCountry = require('../client-location').getCountry
    try {
      await getCountry()
    } catch (e) {}
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('does log an error for a problematic MaxMind error', async () => {
    expect.assertions(1)

    const logger = require('utils/logger').default

    // Suppress expected console error
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    // Mock a MaxMind error
    mockGeoIP.country.mockImplementationOnce((successCallback, failureCallback) => {
      return failureCallback({ code: 'OUT_OF_QUERIES' })
    })

    const getCountry = require('../client-location').getCountry
    try {
      await getCountry()
    } catch (e) {}
    expect(logger.error).toHaveBeenCalled()
  })
})
