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

  it('returns an instance of MockAdClient if no name match', () => {
    jest.mock('../activeAdClient', () => {
      return {
        getActiveAdServerName: () => 'fakeAdserverName'
      }
    })
    const AdServer = require('../AdClient').default
    const MockAdClient = require('../AdClient').MockAdClient
    expect(AdServer).toBeInstanceOf(MockAdClient)
  })
})
