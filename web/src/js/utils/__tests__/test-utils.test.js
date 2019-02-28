/* eslint-env jest */

afterEach(() => {
  jest.clearAllMocks()
})

describe('web test-utils', () => {
  test('mockGoogleTagSlotRenderEndedData returns expected defaults', () => {
    const mockGoogleTagSlotRenderEndedData = require('js/utils/test-utils')
      .mockGoogleTagSlotRenderEndedData
    const slotRenderEndedData = mockGoogleTagSlotRenderEndedData()
    expect(slotRenderEndedData).toMatchObject({
      advertiserId: 1234,
      campaignId: 99887766,
      creativeId: 111222333444555,
      isEmpty: false,
      lineItemId: 123456,
      serviceName: 'something',
      size: '728x90',
      sourceAgnosticCreativeId: null,
      sourceAgnosticLineItemId: null,
    })
    expect(slotRenderEndedData).toHaveProperty('slot.getSlotElementId')
    expect(slotRenderEndedData.slot.getSlotElementId()).toBe('abc-123')
  })

  test('mockGoogleTagSlotRenderEndedData allows overriding slot ID and properties', () => {
    const mockGoogleTagSlotRenderEndedData = require('js/utils/test-utils')
      .mockGoogleTagSlotRenderEndedData
    const slotRenderEndedData = mockGoogleTagSlotRenderEndedData(
      'foobar',
      '/some/ad-unit/',
      {
        advertiserId: null,
        campaignId: 1357,
        creativeId: 2468,
        lineItemId: 1001,
      }
    )
    expect(slotRenderEndedData).toMatchObject({
      advertiserId: null,
      campaignId: 1357,
      creativeId: 2468,
      isEmpty: false,
      lineItemId: 1001,
      serviceName: 'something',
      size: '728x90',
      sourceAgnosticCreativeId: null,
      sourceAgnosticLineItemId: null,
    })
    expect(slotRenderEndedData).toHaveProperty('slot.getSlotElementId')
    expect(slotRenderEndedData.slot.getSlotElementId()).toBe('foobar')
  })

  test('mockAmazonBidResponse returns expected mock', () => {
    const mockAmazonBidResponse = require('js/utils/test-utils')
      .mockAmazonBidResponse
    const mockAmazonBid = mockAmazonBidResponse({
      slotID: 'abx-xyz',
    })
    expect(mockAmazonBid).toEqual({
      amznbid: '1',
      amzniid: 'some-id',
      amznp: '1',
      amznsz: '0x0',
      size: '0x0',
      slotID: 'abx-xyz',
    })
  })

  test('flushAllPromises works as expected', async () => {
    expect.assertions(1)

    const flushAllPromises = require('js/utils/test-utils').flushAllPromises

    const anotherTestFunc = jest.fn()
    const testFunc = () => {
      Promise.resolve().then(() => {
        anotherTestFunc('hi')
      })
    }

    testFunc()
    await flushAllPromises()
    expect(anotherTestFunc).toHaveBeenCalledWith('hi')
  })

  test('without flushAllPromises, the same test as above would fail', async () => {
    expect.assertions(1)

    const anotherTestFunc = jest.fn()
    const testFunc = () => {
      Promise.resolve().then(() => {
        anotherTestFunc('hi')
      })
    }

    testFunc()
    expect(anotherTestFunc).not.toHaveBeenCalled()
  })

  test('runAsyncTimerLoops works as expected', async () => {
    expect.assertions(1)
    jest.useFakeTimers()

    const runAsyncTimerLoops = require('js/utils/test-utils').runAsyncTimerLoops

    const anotherTestFunc = jest.fn()
    var counter = 0
    const testFunc = () => {
      if (counter > 2) {
        anotherTestFunc('hi')
      }
      Promise.resolve().then(() => {
        setTimeout(() => {
          counter += 1
          testFunc()
        }, 5)
      })
    }

    testFunc()
    await runAsyncTimerLoops(5)
    expect(anotherTestFunc).toHaveBeenCalledWith('hi')
  })

  test('without runAsyncTimerLoops, the same test as above would fail (jest.runAllTimers is not sufficient)', async () => {
    expect.assertions(1)
    jest.useFakeTimers()

    const anotherTestFunc = jest.fn()
    var counter = 0
    const testFunc = () => {
      if (counter > 2) {
        anotherTestFunc('hi')
      }
      Promise.resolve().then(() => {
        setTimeout(() => {
          counter += 1
          testFunc()
        }, 5)
      })
    }

    testFunc()

    // Trying to use just run all timers.
    jest.runAllTimers()

    expect(anotherTestFunc).not.toHaveBeenCalled()
  })

  test('without runAsyncTimerLoops, the same test as above would fail (flushAllPromises is not sufficient)', async () => {
    expect.assertions(1)
    jest.useFakeTimers()

    const flushAllPromises = require('js/utils/test-utils').flushAllPromises

    const anotherTestFunc = jest.fn()
    var counter = 0
    const testFunc = () => {
      if (counter > 2) {
        anotherTestFunc('hi')
      }
      Promise.resolve().then(() => {
        setTimeout(() => {
          counter += 1
          testFunc()
        }, 5)
      })
    }

    testFunc()

    // Trying to use just run all timers.
    jest.runAllTimers()

    await flushAllPromises()
    expect(anotherTestFunc).not.toHaveBeenCalled()
  })

  test('setWindowLocation modifies the window.location object', () => {
    const { setWindowLocation } = require('js/utils/test-utils')
    expect(window.location.hostname).not.toEqual('foo.com')
    setWindowLocation({
      hostname: 'foo.com',
    })
    expect(window.location.hostname).toEqual('foo.com')
  })

  test('impersonateReactSnapClient sets the user agent to ReactSnap', () => {
    const { impersonateReactSnapClient } = require('js/utils/test-utils')
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Something',
      writable: true,
    })
    expect(window.navigator.userAgent).toEqual('Something')
    impersonateReactSnapClient()
    expect(window.navigator.userAgent).toEqual('ReactSnap')
  })

  test('setUserAgentToTypicalTestUserAgent sets the user agent to Mozilla etc.', () => {
    const {
      setUserAgentToTypicalTestUserAgent,
    } = require('js/utils/test-utils')
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Something',
      writable: true,
    })
    expect(window.navigator.userAgent).toEqual('Something')
    setUserAgentToTypicalTestUserAgent()
    expect(window.navigator.userAgent).toEqual(
      'Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/11.12.0'
    )
  })

  test('addReactRootElementToDOM adds a div with ID "root" to the DOM', () => {
    const { addReactRootElementToDOM } = require('js/utils/test-utils')
    expect(document.getElementById('root')).toBeNull()
    addReactRootElementToDOM()
    expect(document.getElementById('root')).not.toBeNull()
  })
})
