/* eslint-env jest */

import jsdom from 'jsdom'

beforeEach(() => {
  jest.resetModules()
})

describe('getting referral data', () => {
  it('works with all fields set', () => {
    const mockSetItem = jest.fn()
    jest.mock('../localstorage-mgr', () => {
      return {
        getItem: (key) => {
          switch (key) {
            case 'tab.referralData.referringUser':
              return 'sandra'
            case 'tab.referralData.referringChannel':
              return '42'
            default:
              return undefined
          }
        },
        setItem: mockSetItem
      }
    })
    const getReferralData = require('../utils').getReferralData
    expect(getReferralData()).toEqual({
      referringUser: 'sandra',
      referringChannel: '42'
    })
  })

  it('works with only referring user', () => {
    jest.mock('../localstorage-mgr', () => {
      return {
        getItem: (key) => {
          switch (key) {
            case 'tab.referralData.referringUser':
              return 'bob'
            case 'tab.referralData.referringChannel':
              return undefined
            default:
              return undefined
          }
        }
      }
    })
    const getReferralData = require('../utils').getReferralData
    expect(getReferralData()).toEqual({
      referringUser: 'bob'
    })
  })

  it('works with only referring channel', () => {
    jest.mock('../localstorage-mgr', () => {
      return {
        getItem: (key) => {
          switch (key) {
            case 'tab.referralData.referringUser':
              return undefined
            case 'tab.referralData.referringChannel':
              return '33'
            default:
              return undefined
          }
        }
      }
    })
    const getReferralData = require('../utils').getReferralData
    expect(getReferralData()).toEqual({
      referringChannel: '33'
    })
  })
})

describe('number utils', () => {
  it('comma-formats correctly', () => {
    const commaFormatted = require('../utils').commaFormatted
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
    const currencyFormatted = require('../utils').currencyFormatted
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
    const abbreviateNumber = require('../utils').abbreviateNumber

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
    expect(abbreviateNumber(460932.00)).toBe('460.9K')
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
    const isInIframe = require('../utils').isInIframe
    expect(isInIframe()).toBe(false)
  })

  it('detects when in iframe', () => {
    // Fake that the top window is some other window
    jsdom.reconfigureWindow(window, { top: { some: 'other-window' } })
    const isInIframe = require('../utils').isInIframe
    expect(isInIframe()).toBe(true)

    // Reset the top window
    jsdom.reconfigureWindow(window, { top: window.self })
  })
})
