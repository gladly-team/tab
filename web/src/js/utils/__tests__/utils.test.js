/* eslint-env jest */

import localStorageMgr, { __mockClear } from 'js/utils/localstorage-mgr'

jest.mock('js/utils/localstorage-mgr')

afterEach(() => {
  __mockClear()
})

describe('validating username', () => {
  it('accepts alphanumeric usernames', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('blah')).toEqual(true)
    expect(validateUsername('somebody123')).toEqual(true)
  })

  it('rejects usernames that are too short', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('')).toEqual(false)
    expect(validateUsername('a')).toEqual(false)
    expect(validateUsername('aa')).toEqual(true)
  })

  it('accepts common special characters', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('somebody_123')).toEqual(true)
    expect(validateUsername('somebody-123')).toEqual(true)
    expect(validateUsername('somebody$123')).toEqual(true)
    expect(validateUsername('somebody*123')).toEqual(true)
    expect(validateUsername('somebody!123')).toEqual(true)
  })

  it('accepts modified Roman letters', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('óóóó')).toEqual(true)
    expect(validateUsername('åååå')).toEqual(true)
  })

  it('accepts Mandarin', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('我我我我')).toEqual(true)
  })

  it('accpets other special characters', () => {
    const validateUsername = require('js/utils/utils').validateUsername
    expect(validateUsername('©©©©')).toEqual(true)
    expect(validateUsername('💩💩💩💩')).toEqual(true)
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
  it('works with all fields set', () => {
    localStorageMgr.setItem('tab.referralData.referringUser', 'sandra')
    localStorageMgr.setItem('tab.referralData.referringChannel', '42')
    const getReferralData = require('js/utils/utils').getReferralData
    expect(getReferralData()).toEqual({
      referringUser: 'sandra',
      referringChannel: '42',
    })
  })

  it('works with only referring user', () => {
    localStorageMgr.setItem('tab.referralData.referringUser', 'bob')
    localStorageMgr.setItem('tab.referralData.referringChannel', undefined)
    const getReferralData = require('js/utils/utils').getReferralData
    expect(getReferralData()).toEqual({
      referringUser: 'bob',
    })
  })

  it('works with only referring channel', () => {
    localStorageMgr.setItem('tab.referralData.referringUser', undefined)
    localStorageMgr.setItem('tab.referralData.referringChannel', '33')
    const getReferralData = require('js/utils/utils').getReferralData
    expect(getReferralData()).toEqual({
      referringChannel: '33',
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
