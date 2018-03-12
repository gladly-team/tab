/* eslint-env jest */

import { mockGoogleTagSlotOnloadData } from 'utils/test-utils'

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
    const mockSlotLoadEventData = mockGoogleTagSlotOnloadData('xyx-123')
    passedEventCallback(mockSlotLoadEventData)

    // Check that we're using the expected GPT event
    expect(passedEventName).toEqual('slotOnload')

    // Make sure we've marked the slot as loaded
    expect(window.tabforacause.ads.slotsLoaded['xyx-123']).toBe(true)

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
