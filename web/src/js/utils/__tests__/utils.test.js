/* eslint-env jest */

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
