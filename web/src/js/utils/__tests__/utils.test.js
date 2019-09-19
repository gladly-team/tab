/* eslint-env jest */

import localStorageMgr, { __mockClear } from 'js/utils/localstorage-mgr'
import { flushAllPromises } from 'js/utils/test-utils'

jest.mock('js/utils/localstorage-mgr')

afterEach(() => {
  __mockClear()
})

describe('validating username', () => {
  it('accepts alphanumeric usernames', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('blah')).toEqual({
      isValid: true,
      reason: 'NONE',
    })
    expect(validateUsername('somebody123')).toEqual({
      isValid: true,
      reason: 'NONE',
    })
  })

  it('rejects usernames that are too short', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('')).toEqual({
      isValid: false,
      reason: 'TOO_SHORT',
    })
    expect(validateUsername('a')).toEqual({
      isValid: false,
      reason: 'TOO_SHORT',
    })
    expect(validateUsername('aa')).toEqual({
      isValid: true,
      reason: 'NONE',
    })
  })

  it('rejects usernames with "@"', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('@@')).toEqual({
      isValid: false,
      reason: 'NO_AT_SIGN',
    })
    expect(validateUsername('hi@blah')).toEqual({
      isValid: false,
      reason: 'NO_AT_SIGN',
    })
    expect(validateUsername('x@@@@@@x')).toEqual({
      isValid: false,
      reason: 'NO_AT_SIGN',
    })
    expect(validateUsername('hello@')).toEqual({
      isValid: false,
      reason: 'NO_AT_SIGN',
    })
  })

  it('rejects usernames with spaces', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('My Name')).toEqual({
      isValid: false,
      reason: 'NO_SPACES',
    })
    expect(validateUsername('   ')).toEqual({
      isValid: false,
      reason: 'NO_SPACES',
    })
    expect(validateUsername('SpaceAtEndOops ')).toEqual({
      isValid: false,
      reason: 'NO_SPACES',
    })
  })

  it('accepts common special characters', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('somebody_123')).toEqual({
      isValid: true,
      reason: 'NONE',
    })
    expect(validateUsername('somebody-123')).toEqual({
      isValid: true,
      reason: 'NONE',
    })
    expect(validateUsername('somebody$123')).toEqual({
      isValid: true,
      reason: 'NONE',
    })
    expect(validateUsername('somebody*123')).toEqual({
      isValid: true,
      reason: 'NONE',
    })
    expect(validateUsername('somebody!123')).toEqual({
      isValid: true,
      reason: 'NONE',
    })
  })

  it('accepts modified Roman letters', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('óóóó')).toEqual({
      isValid: true,
      reason: 'NONE',
    })
    expect(validateUsername('åååå')).toEqual({
      isValid: true,
      reason: 'NONE',
    })
  })

  it('accepts Mandarin', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('我我我我')).toEqual({
      isValid: true,
      reason: 'NONE',
    })
  })

  it('accpets other special characters', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('©©©©')).toEqual({
      isValid: true,
      reason: 'NONE',
    })
    expect(validateUsername('💩💩💩💩')).toEqual({
      isValid: true,
      reason: 'NONE',
    })
  })
})

describe('URL query string utils', () => {
  test('parseUrlSearchString parses URL parameters as expected', () => {
    localStorageMgr.setItem('tab.referralData.referringUser', 'sandra')
    localStorageMgr.setItem('tab.referralData.referringChannel', '42')
    const parseUrlSearchString = require('js/utils/utils').parseUrlSearchString
    expect(parseUrlSearchString('?myParam=foo&another=123')).toEqual({
      myParam: 'foo',
      another: '123',
    })
  })
})

describe('getting referral data', () => {
  it('works with all Tab fields set', () => {
    localStorageMgr.setItem('tab.referralData.referringUser', 'sandra')
    localStorageMgr.setItem('tab.referralData.referringChannel', '42')
    const getReferralData = require('js/utils/utils').getReferralData
    expect(getReferralData()).toEqual({
      referringUser: 'sandra',
      referringChannel: '42',
    })
  })

  it('works with only a Tab referring user value', () => {
    localStorageMgr.setItem('tab.referralData.referringUser', 'bob')
    localStorageMgr.setItem('tab.referralData.referringChannel', undefined)
    const getReferralData = require('js/utils/utils').getReferralData
    expect(getReferralData()).toEqual({
      referringUser: 'bob',
    })
  })

  it('works with only a Tab referring channel value', () => {
    localStorageMgr.setItem('tab.referralData.referringUser', undefined)
    localStorageMgr.setItem('tab.referralData.referringChannel', '33')
    const getReferralData = require('js/utils/utils').getReferralData
    expect(getReferralData()).toEqual({
      referringChannel: '33',
    })
  })

  it('works with all Search fields set', () => {
    localStorageMgr.setItem('search.referralData.referringUser', 'chandrika')
    localStorageMgr.setItem('search.referralData.referringChannel', '7')
    const getReferralData = require('js/utils/utils').getReferralData
    expect(getReferralData()).toEqual({
      referringUser: 'chandrika',
      referringChannel: '7',
    })
  })

  it('works with only a Search referring user value', () => {
    localStorageMgr.setItem(
      'search.referralData.referringUser',
      'SnailLEnthusiast'
    )
    localStorageMgr.setItem('search.referralData.referringChannel', undefined)
    const getReferralData = require('js/utils/utils').getReferralData
    expect(getReferralData()).toEqual({
      referringUser: 'SnailLEnthusiast',
    })
  })

  it('works with only a Search referring channel value', () => {
    localStorageMgr.setItem('search.referralData.referringUser', undefined)
    localStorageMgr.setItem('search.referralData.referringChannel', '22')
    const getReferralData = require('js/utils/utils').getReferralData
    expect(getReferralData()).toEqual({
      referringChannel: '22',
    })
  })

  it('uses Tab referral values when both Tab and Search values are set', () => {
    localStorageMgr.setItem('tab.referralData.referringUser', 'sandra')
    localStorageMgr.setItem('tab.referralData.referringChannel', '42')
    localStorageMgr.setItem('search.referralData.referringUser', 'chandrika')
    localStorageMgr.setItem('search.referralData.referringChannel', '7')
    const getReferralData = require('js/utils/utils').getReferralData
    expect(getReferralData()).toEqual({
      referringUser: 'sandra',
      referringChannel: '42',
    })
  })

  it('uses one of each referral values when one Tab value is set and another Search value is set', () => {
    localStorageMgr.setItem('tab.referralData.referringUser', 'sandra')
    localStorageMgr.setItem('search.referralData.referringChannel', '7')
    const getReferralData = require('js/utils/utils').getReferralData
    expect(getReferralData()).toEqual({
      referringUser: 'sandra',
      referringChannel: '7',
    })
  })
})

describe('number utils', () => {
  it('comma-formats correctly', () => {
    const commaFormatted = require('js/utils/utils').commaFormatted
    expect(commaFormatted('460932.44')).toBe('460,932.44')
    expect(commaFormatted('460932')).toBe('460,932')
    expect(commaFormatted('123456789')).toBe('123,456,789')
    expect(commaFormatted('21')).toBe('21')
    expect(commaFormatted(460932.44)).toBe('460,932.44')
    expect(commaFormatted(0)).toBe('0')

    // Handles bad values
    expect(commaFormatted(undefined)).toBe('0')
    expect(commaFormatted(null)).toBe('0')
  })

  it('formats currency correctly', () => {
    const currencyFormatted = require('js/utils/utils').currencyFormatted
    expect(currencyFormatted('460932.44')).toBe('460932.44')
    expect(currencyFormatted('460932')).toBe('460932.00')
    expect(currencyFormatted('460932.1')).toBe('460932.10')
    expect(currencyFormatted('460932.1534454239')).toBe('460932.15')
    expect(currencyFormatted('460932.156')).toBe('460932.16')
    expect(currencyFormatted(460932.44)).toBe('460932.44')
    expect(currencyFormatted(0)).toBe('0.00')

    // Handles bad values
    expect(currencyFormatted(undefined)).toBe('0.00')
    expect(currencyFormatted(null)).toBe('0.00')
  })

  it('abbreviates numbers correctly', () => {
    const abbreviateNumber = require('js/utils/utils').abbreviateNumber

    // Test ones, tens, hundreds
    expect(abbreviateNumber(0)).toBe('0')
    expect(abbreviateNumber(1)).toBe('1')
    expect(abbreviateNumber(19.21)).toBe('19.2')
    expect(abbreviateNumber(19.83)).toBe('19.8')
    expect(abbreviateNumber(19.83, 2)).toBe('19.83')
    expect(abbreviateNumber(936)).toBe('936')

    // Test thousands
    expect(abbreviateNumber(460932)).toBe('460.9K')
    expect(abbreviateNumber(-460932)).toBe('-460.9K')
    expect(abbreviateNumber(460932.0)).toBe('460.9K')
    expect(abbreviateNumber(460932.9999, 3)).toBe('460.933K')
    expect(abbreviateNumber(460932, 0)).toBe('461K')
    expect(abbreviateNumber(460932, 2)).toBe('460.93K')
    expect(abbreviateNumber(460936, 2)).toBe('460.94K')
    expect(abbreviateNumber(460936, 18)).toBe('460.936K')

    // Test millions and billions
    expect(abbreviateNumber(248052401)).toBe('248.1M')
    expect(abbreviateNumber(248052401, 2)).toBe('248.05M')
    expect(abbreviateNumber(4424852401)).toBe('4.4B')
    expect(abbreviateNumber(4424852401, 4)).toBe('4.4249B')

    // Handles bad values
    expect(abbreviateNumber(undefined)).toBe('0')
    expect(abbreviateNumber(null)).toBe('0')
  })
})

describe('iframe utils', () => {
  it('detects when not in iframe', () => {
    const isInIframe = require('js/utils/utils').isInIframe
    expect(isInIframe()).toBe(false)
  })

  // Disabling for now because of lack of easy way to change window.top:
  // https://github.com/facebook/jest/issues/5124
  // it('detects when in iframe', () => {
  //   // Fake that the top window is some other window
  //   jsdom.reconfigureWindow(window, { top: { some: 'other-window' } })
  //   const isInIframe = require('js/utils/utils').isInIframe
  //   expect(isInIframe()).toBe(true)

  //   // Reset the top window
  //   jsdom.reconfigureWindow(window, { top: window.self })
  // })
})

describe('domain name utils', () => {
  it('returns expected production domain names', () => {
    const { getProductionDomainNames } = require('js/utils/utils')
    expect(getProductionDomainNames()).toEqual(['tab.gladly.io'])
  })

  it('returns expected development domain names', () => {
    const { getDevelopmentDomainNames } = require('js/utils/utils')
    expect(getDevelopmentDomainNames()).toEqual([
      'test-tab2017.gladly.io',
      'dev-tab2017.gladly.io',
    ])
  })

  it('returns expected local development domain names', () => {
    const { getLocalDevelopmentDomainNames } = require('js/utils/utils')
    expect(getLocalDevelopmentDomainNames()).toEqual([
      'localhost:3000',
      'local-dev-tab.gladly.io:3000',
    ])
  })

  it('returns expected domain names in aggregate', () => {
    const { getAllDomainNames } = require('js/utils/utils')
    expect(getAllDomainNames()).toEqual([
      'localhost:3000',
      'local-dev-tab.gladly.io:3000',
      'test-tab2017.gladly.io',
      'dev-tab2017.gladly.io',
      'tab.gladly.io',
    ])
  })
})

describe('makePromiseCancelable', () => {
  it('returns the expected object', () => {
    const { makePromiseCancelable } = require('js/utils/utils')
    expect(makePromiseCancelable(new Promise(() => {}))).toEqual({
      promise: expect.any(Promise),
      cancel: expect.any(Function),
    })
  })

  it('resolves as expected', async () => {
    expect.assertions(1)
    const { makePromiseCancelable } = require('js/utils/utils')
    const prom = Promise.resolve({ data: 'hi!' })
    const cancelablePromise = makePromiseCancelable(prom)
    cancelablePromise.promise
      .then(response => {
        expect(response.data).toEqual('hi!')
      })
      .catch(e => {
        throw e
      })
    await flushAllPromises()
  })

  it('rejects with "isCanceled" true when canceled', async () => {
    expect.assertions(1)
    const { makePromiseCancelable } = require('js/utils/utils')
    const prom = Promise.resolve()
    const cancelablePromise = makePromiseCancelable(prom)
    cancelablePromise.promise
      .then(() => {})
      .catch(e => {
        expect(e.isCanceled).toBe(true)
      })
    cancelablePromise.cancel()
    await flushAllPromises()
  })

  it('rejects with "isCanceled" undefined when some other error throws', async () => {
    expect.assertions(1)
    const { makePromiseCancelable } = require('js/utils/utils')
    const prom = Promise.reject(new Error('Uh oh'))
    const cancelablePromise = makePromiseCancelable(prom)
    return cancelablePromise.promise
      .then(() => {})
      .catch(e => {
        expect(e.isCanceled).toBeUndefined()
      })
  })
})

describe('getTabGlobal', () => {
  afterEach(() => {
    delete window.tabforacause
  })

  it('returns an object with the expected keys', () => {
    const { getTabGlobal } = require('js/utils/utils')
    expect(Object.keys(getTabGlobal()).sort()).toEqual(['ads', 'featureFlags'])
  })

  it('returns an ads object with the expected keys', () => {
    const { getTabGlobal } = require('js/utils/utils')
    expect(Object.keys(getTabGlobal().ads).sort()).toEqual([
      'amazonBids',
      'indexExchangeBids',
      'slotsAlreadyLoggedRevenue',
      'slotsLoaded',
      'slotsRendered',
      'slotsViewable',
    ])
  })

  it('sets window.tabforacause', () => {
    delete window.tabforacause
    expect(window.tabforacause).toBeUndefined()
    const { getTabGlobal } = require('js/utils/utils')
    getTabGlobal()
    expect(window.tabforacause).not.toBeUndefined()
  })

  it('uses existing window.tabforacause object if one exists', () => {
    const existingTabGlobal = {
      ads: {
        amazonBids: {
          someThing: 'here',
        },
        slotsRendered: {},
        slotsViewable: {},
        slotsLoaded: {},
        slotsAlreadyLoggedRevenue: {},
      },
      featureFlags: {},
    }
    window.tabforacause = existingTabGlobal
    const { getTabGlobal } = require('js/utils/utils')
    const tabGlobal = getTabGlobal()
    expect(tabGlobal).toBe(existingTabGlobal)
  })
})

describe('validateAppName', () => {
  it('returns "tab" when provided "tab"', () => {
    const { validateAppName } = require('js/utils/utils')
    expect(validateAppName('tab')).toEqual('tab')
  })

  it('returns "search" when provided "search"', () => {
    const { validateAppName } = require('js/utils/utils')
    expect(validateAppName('search')).toEqual('search')
  })

  it('returns "tab" when provided undefined', () => {
    const { validateAppName } = require('js/utils/utils')
    expect(validateAppName()).toEqual('tab')
  })

  it('returns "tab" when provided some nonsense value', () => {
    const { validateAppName } = require('js/utils/utils')
    expect(validateAppName('beebop')).toEqual('tab')
  })
})
