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
