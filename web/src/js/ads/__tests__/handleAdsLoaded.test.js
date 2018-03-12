/* eslint-env jest */

beforeEach(() => {
  delete window.googletag
  delete window.tabforacause

  // Mock googletag
  const mockAddEventListener = jest.fn()
  window.googletag = {
    cmd: [],
    pubads: () => ({
      addEventListener: mockAddEventListener
    })
  }

  // Mock tabforacause global
  window.tabforacause = {
    ads: {
      slotsLoaded: {},
      slotsAlreadyLoggedRevenue: {}
    }
  }

  jest.clearAllMocks()
  jest.resetModules()
})

afterAll(() => {
  delete window.googletag
  delete window.tabforacause
})

describe('handleAdsLoaded', function () {
  it('adds a slot ID to window.tabforacause\'s "loaded slots" object when GPT\'s "slotOnload" event is fired', () => {
    // Mock GPT's pubads addEventListener so we can fake an event
    var passedEventName
    var passedEventCallback
    window.googletag.pubads().addEventListener.mockImplementation((eventName, callback) => {
      passedEventName = eventName
      passedEventCallback = callback
    })

    const handleAdsLoaded = require('../handleAdsLoaded').default
    handleAdsLoaded()

    // Run the queued googletag commands
    window.googletag.cmd.forEach((cmd) => cmd())

    // Fake the event callback
    // https://developers.google.com/doubleclick-gpt/reference#googletageventsslotonloadevent
    const slotId = 'abc-123'
    const mockSlotLoadEventData = {
      // https://developers.google.com/doubleclick-gpt/reference#googletagslot
      slot: {
        getSlotElementId: () => slotId
        // ... other methods here
      },
      advertiserId: 1234,
      campaignId: 99887766,
      creativeId: 111222333444555,
      isEmpty: false,
      lineItemId: 123456,
      serviceName: 'something',
      size: '728x90',
      sourceAgnosticCreativeId: null,
      sourceAgnosticLineItemId: null
    }
    passedEventCallback(mockSlotLoadEventData)

    // Check that we're using the expected GPT event
    expect(passedEventName).toEqual('slotOnload')

    // Make sure we've marked the slot as loaded
    expect(window.tabforacause.ads.slotsLoaded[slotId]).toBe(true)

    // Make sure it works multiple times
    const otherSlotId = 'xyz-987'
    expect(window.tabforacause.ads.slotsLoaded[otherSlotId]).toBeUndefined()
    passedEventCallback({
      slot: {
        getSlotElementId: () => otherSlotId
      }
    })
    expect(window.tabforacause.ads.slotsLoaded[otherSlotId]).toBe(true)
  })
})
