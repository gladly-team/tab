/* eslint-env jest */

jest.mock('blockadblock')

beforeEach(() => {
  window.blockAdBlock = {
    onDetected: jest.fn(),
    onNotDetected: jest.fn(),
    setOptions: jest.fn(),
  }
})

afterEach(() => {
  jest.resetModules()
})

describe('detectAdblocker', () => {
  it('resolves to false when not detected', done => {
    expect.assertions(1)

    // Mock that blockadblock detects an ad blocker.
    window.blockAdBlock.onNotDetected.mockImplementation(callback => {
      callback()
    })

    const detectAdblocker = require('js/utils/detectAdblocker').default
    detectAdblocker()
      .then(isEnabled => {
        expect(isEnabled).toBe(false)
        done()
      })
      .catch(e => {
        throw e
      })
  })

  it('resolves to true when detected', done => {
    expect.assertions(1)

    // Mock that blockadblock does not detect an ad blocker.
    window.blockAdBlock.onDetected.mockImplementation(callback => {
      callback()
    })

    const detectAdblocker = require('js/utils/detectAdblocker').default
    detectAdblocker()
      .then(isEnabled => {
        expect(isEnabled).toBe(true)
        done()
      })
      .catch(e => {
        throw e
      })
  })

  it('resolves to true when window.blockAdBlock is not defined', done => {
    expect.assertions(1)

    // This may happen if an ad blocker blocks the script.
    delete window.blockAdBlock

    const detectAdblocker = require('js/utils/detectAdblocker').default
    detectAdblocker()
      .then(isEnabled => {
        expect(isEnabled).toBe(true)
        done()
      })
      .catch(e => {
        throw e
      })
  })

  it('throws if there is some error', () => {
    window.blockAdBlock.onDetected.mockImplementation(() => {
      throw new Error('Some blockadblock error.')
    })

    const detectAdblocker = require('js/utils/detectAdblocker').default
    return expect(detectAdblocker()).rejects.toThrow('Some blockadblock error.')
  })
})
