/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'
import { mockGoogleTagSlotRenderEndedData } from 'utils/test-utils'

import LogUserRevenueMutation from 'mutations/LogUserRevenueMutation'

jest.mock('mutations/LogUserRevenueMutation')

beforeEach(() => {
  delete window.googletag
  delete window.pbjs
  delete window.tabforacause

  // Mock googletag
  const mockAddEventListener = jest.fn()
  window.googletag = {
    cmd: [],
    pubads: () => ({
      addEventListener: mockAddEventListener
    })
  }

  // Mock pbjs
  window.pbjs = {
    getHighestCpmBids: jest.fn()
  }

  // Mock tabforacause global
  window.tabforacause = {
    ads: {
      slotsLoaded: {},
      slotsAlreadyLoggedRevenue: {}
    }
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  delete window.googletag
  delete window.pbjs
  delete window.tabforacause
})

describe('LogRevenueComponent', function () {
  it('renders without error and does not have any DOM elements', () => {
    const LogRevenueComponent = require('../LogRevenueComponent').default
    const wrapper = shallow(
      <LogRevenueComponent
        user={{ id: 'abcdefghijklmno' }}
        relay={{ environment: {} }}
        />
    )
    expect(toJson(wrapper)).toEqual('')
  })

  it('on mount, logs revenue for already-loaded slots', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    window.tabforacause.ads.slotsLoaded[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId, { advertiserId: 132435 })

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 0.172
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([{
      cpm: mockRevenueValue
      // ... other bid info exists here
    }])

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        relay={{ environment: mockRelayEnvironment }}
        />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(mockRelayEnvironment, mockUserId, 0.000172, 132435)

    // It should mark this slot as logged
    expect(window.tabforacause.ads.slotsAlreadyLoggedRevenue[slotId]).toBe(true)
  })

  it('does not log revenue for slots that have already been logged', () => {
    // Mark an ad slot as loaded
    const slotId = 'abc-123'
    window.tabforacause.ads.slotsLoaded[slotId] = mockGoogleTagSlotRenderEndedData(slotId)

    // Mark the ad slot as having already been logged
    window.tabforacause.ads.slotsAlreadyLoggedRevenue[slotId] = true

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 0.172
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([{
      cpm: mockRevenueValue
      // ... other bid info exists here
    }])

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        relay={{ environment: mockRelayEnvironment }}
        />
    )

    expect(LogUserRevenueMutation).not.toHaveBeenCalled()
  })

  it('does not throw an error or log revenue if there are not any bids for a slot', () => {
    // Mark an ad slot as loaded
    const slotId = 'abc-123'
    window.tabforacause.ads.slotsLoaded[slotId] = true

    // Mark the ad slot as having already been logged
    window.tabforacause.ads.slotsLoaded[slotId] = mockGoogleTagSlotRenderEndedData(slotId)

    // Mock no Prebid bids for the slot
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([])

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        relay={{ environment: mockRelayEnvironment }}
        />
    )

    expect(LogUserRevenueMutation).not.toHaveBeenCalled()
  })

  it('rounds excessively long decimals in revenue value', () => {
    // Mark an ad slot as loaded
    const slotId = 'abc-123'
    window.tabforacause.ads.slotsLoaded[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId, { advertiserId: 9876543 })

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 0.12345678901234567890
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([{
      cpm: mockRevenueValue
      // ... other bid info exists here
    }])

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        relay={{ environment: mockRelayEnvironment }}
        />
    )

    expect(LogUserRevenueMutation).toHaveBeenCalledWith(mockRelayEnvironment, mockUserId,
      0.000123456789012, 9876543)
  })

  it('after mount, logs revenue when GPT fires a "slot loaded" event', () => {
    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 2.31
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([{
      cpm: mockRevenueValue
      // ... other bid info exists here
    }])

    // Mock GPT's pubads addEventListener so we can fake an event
    var passedEventCallback
    window.googletag.pubads().addEventListener.mockImplementation((eventName, callback) => {
      passedEventCallback = callback
    })

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        relay={{ environment: mockRelayEnvironment }}
        />
    )

    // Should not have logged anything yet
    expect(LogUserRevenueMutation).not.toHaveBeenCalled()

    // Run the queued googletag commands
    window.googletag.cmd.forEach((cmd) => cmd())

    // Fake the GPT event callback
    // https://developers.google.com/doubleclick-gpt/reference#googletag.events.SlotRenderEndedEvent
    const slotId = 'xyz-987'
    passedEventCallback(mockGoogleTagSlotRenderEndedData(
      slotId, { advertiserId: 159260 }))

    // Should have logged revenue after the slot loaded
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(mockRelayEnvironment,
      mockUserId, 0.00231, 159260)
  })

  it('defaults to 99 (Google Adsense) DFP Advertiser ID when the advertiser ID does not exist', () => {
    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 2.31
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([{
      cpm: mockRevenueValue
      // ... other bid info exists here
    }])

    // Mock GPT's pubads addEventListener so we can fake an event
    var passedEventCallback
    window.googletag.pubads().addEventListener.mockImplementation((eventName, callback) => {
      passedEventCallback = callback
    })

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        relay={{ environment: mockRelayEnvironment }}
        />
    )

    // Should not have logged anything yet
    expect(LogUserRevenueMutation).not.toHaveBeenCalled()

    // Run the queued googletag commands
    window.googletag.cmd.forEach((cmd) => cmd())

    // Fake the GPT event callback
    // https://developers.google.com/doubleclick-gpt/reference#googletag.events.SlotRenderEndedEvent
    const slotId = 'xyz-987'
    const mockSlotRenderEndedData = mockGoogleTagSlotRenderEndedData(slotId, {
      advertiserId: null,
      campaignId: null,
      creativeId: null
    })
    passedEventCallback(mockSlotRenderEndedData)

    // Should have logged revenue after the slot loaded
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(mockRelayEnvironment,
      mockUserId, 0.00231, 99)
  })
})
