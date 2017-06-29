/* eslint-env jest */

jest.mock('../activeAdClient', () => {
  return {
    getActiveAdServerName: () => 'mock'
  }
})

beforeEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('AdServer import', function () {
  it('returns an instance of MockAdClient', () => {
    jest.mock('../activeAdClient', () => {
      return {
        getActiveAdServerName: () => 'mock'
      }
    })
    const AdServer = require('../AdClient').default
    const MockAdClient = require('../AdClient').MockAdClient
    expect(AdServer).toBeInstanceOf(MockAdClient)
  })

  it('returns an instance of DFP', () => {
    jest.mock('../activeAdClient', () => {
      return {
        getActiveAdServerName: () => 'dfp'
      }
    })
    const AdServer = require('../AdClient').default
    const DFP = require('../AdClient').DFP
    expect(AdServer).toBeInstanceOf(DFP)
  })

  it('throws with an invalid ad server name', () => {
    jest.mock('../activeAdClient', () => {
      return {
        getActiveAdServerName: () => 'fakeAdserverName'
      }
    })
    expect(() => {
      const AdServer = require('../AdClient').default // eslint-disable-line
    }).toThrow()
  })
})
