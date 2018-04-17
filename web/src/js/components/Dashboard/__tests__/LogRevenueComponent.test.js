/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'
import {
  getDefaultTabGlobal,
  mockAmazonBidResponse,
  mockGoogleTagSlotRenderEndedData
} from 'utils/test-utils'

import LogUserRevenueMutation from 'mutations/LogUserRevenueMutation'

jest.mock('mutations/LogUserRevenueMutation')

beforeEach(() => {
  delete window.googletag
  delete window.pbjs
  delete window.apstag
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

  // Mock apstag
  window.apstag = require('apstag')

  // Mock tabforacause global
  window.tabforacause = getDefaultTabGlobal()
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  delete window.googletag
  delete window.pbjs
  delete window.apstag
  delete window.tabforacause
})

describe('LogRevenueComponent', function () {
  it('renders without error and does not have any DOM elements', () => {
    const LogRevenueComponent = require('../LogRevenueComponent').default
    const wrapper = shallow(
      <LogRevenueComponent
        user={{ id: 'abcdefghijklmno' }}
        tabId={'712dca1a-3705-480f-95ff-314be86a2936'}
        relay={{ environment: {} }}
      />
    )
    expect(toJson(wrapper)).toEqual('')
  })

  it('on mount, logs revenue for already-loaded slots', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    window.tabforacause.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId, { advertiserId: 132435 })
    // We use "slotsViewable" as the measure of ads already loaded
    // window.tabforacause.ads.slotsLoaded[slotId] = true
    window.tabforacause.ads.slotsViewable[slotId] = true

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 0.172
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([{
      cpm: mockRevenueValue
      // ... other bid info exists here
    }])

    // Mock no Amazon bids
    window.tabforacause.ads.amazonBids = {}

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(mockRelayEnvironment, mockUserId,
      0.000172, '132435', null, null, tabId)

    // It should mark this slot as logged
    expect(window.tabforacause.ads.slotsAlreadyLoggedRevenue[slotId]).toBe(true)
  })

  it('does not log revenue for slots that have already been logged', () => {
    // Mark an ad slot as loaded
    const slotId = 'abc-123'
    window.tabforacause.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(slotId)
    window.tabforacause.ads.slotsLoaded[slotId] = true
    window.tabforacause.ads.slotsViewable[slotId] = true

    // Mark the ad slot as having already been logged
    window.tabforacause.ads.slotsAlreadyLoggedRevenue[slotId] = true

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 0.172
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([{
      cpm: mockRevenueValue
      // ... other bid info exists here
    }])

    // Mock no Amazon bids
    window.tabforacause.ads.amazonBids = {}

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )

    expect(LogUserRevenueMutation).not.toHaveBeenCalled()
  })

  it('does not throw an error or log revenue if there are not any bids for a slot', () => {
    // Mark an ad slot as loaded
    const slotId = 'abc-123'
    window.tabforacause.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(slotId)
    window.tabforacause.ads.slotsLoaded[slotId] = true
    window.tabforacause.ads.slotsViewable[slotId] = true

    // Mock no Prebid bids for the slot
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([])

    // Mock no Amazon bids
    window.tabforacause.ads.amazonBids = {}

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )

    expect(LogUserRevenueMutation).not.toHaveBeenCalled()
  })

  it('rounds excessively long decimals in revenue value', () => {
    // Mark an ad slot as loaded
    const slotId = 'abc-123'
    window.tabforacause.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId, { advertiserId: 9876543 })
    window.tabforacause.ads.slotsLoaded[slotId] = true
    window.tabforacause.ads.slotsViewable[slotId] = true

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 0.12345678901234567890
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([{
      cpm: mockRevenueValue
      // ... other bid info exists here
    }])

    // Mock no Amazon bids
    window.tabforacause.ads.amazonBids = {}

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )

    expect(LogUserRevenueMutation).toHaveBeenCalledWith(mockRelayEnvironment, mockUserId,
      0.000123456789012, '9876543', null, null, tabId)
  })

  it('after mount, logs revenue when GPT fires a "slot rendered" event', () => {
    const slotId = 'xyz-987'
    window.tabforacause.ads.slotsRendered = {}

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 2.31
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([{
      cpm: mockRevenueValue
      // ... other bid info exists here
    }])

    // Mock no Amazon bids
    window.tabforacause.ads.amazonBids = {}

    // Mock GPT's pubads addEventListener so we can fake an event
    const googleEventListenerCalls = {}
    window.googletag.pubads().addEventListener.mockImplementation((eventName, callback) => {
      if (!googleEventListenerCalls[eventName]) {
        googleEventListenerCalls[eventName] = []
      }
      googleEventListenerCalls[eventName].push([eventName, callback])
    })

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )

    // Should not have logged anything yet
    expect(LogUserRevenueMutation).not.toHaveBeenCalled()

    // Run the queued googletag commands
    window.googletag.cmd.forEach((cmd) => cmd())

    // Fake the GPT event callback
    const eventCallback = googleEventListenerCalls['slotRenderEnded'][0][1]
    eventCallback(
      mockGoogleTagSlotRenderEndedData(slotId, { advertiserId: 159260 })
    )

    // Should have logged revenue after the slot loaded
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(mockRelayEnvironment,
      mockUserId, 0.00231, '159260', null, null, tabId)
  })

  it('defaults to 99 (Google Adsense) DFP Advertiser ID when the advertiser ID does not exist', () => {
    const slotId = 'xyz-987'
    window.tabforacause.ads.slotsRendered = {}

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 2.31
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([{
      cpm: mockRevenueValue
      // ... other bid info exists here
    }])

    // Mock no Amazon bids
    window.tabforacause.ads.amazonBids = {}

    // Mock GPT's pubads addEventListener so we can fake an event
    const googleEventListenerCalls = {}
    window.googletag.pubads().addEventListener.mockImplementation((eventName, callback) => {
      if (!googleEventListenerCalls[eventName]) {
        googleEventListenerCalls[eventName] = []
      }
      googleEventListenerCalls[eventName].push([eventName, callback])
    })

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )

    // Should not have logged anything yet
    expect(LogUserRevenueMutation).not.toHaveBeenCalled()

    // Run the queued googletag commands
    window.googletag.cmd.forEach((cmd) => cmd())

    // Fake the GPT event callback
    const eventCallback = googleEventListenerCalls['slotRenderEnded'][0][1]
    eventCallback(
      mockGoogleTagSlotRenderEndedData(
        slotId,
        {
          advertiserId: null,
          campaignId: null,
          creativeId: null
        }
      )
    )

    // Should have logged revenue after the slot loaded
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(mockRelayEnvironment,
      mockUserId, 0.00231, '99', null, null, tabId)
  })

  it('logs Amazon revenue when there are no Prebid bids', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    window.tabforacause.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId, { advertiserId: 132435 })
    window.tabforacause.ads.slotsLoaded[slotId] = true
    window.tabforacause.ads.slotsViewable[slotId] = true

    // Mock no Prebid bids for the slot
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([])

    // Mock an Amazon bid
    window.tabforacause.ads.amazonBids = {
      [slotId]: mockAmazonBidResponse({
        slotID: slotId,
        amznbid: 'a-bid-code'
      })
    }

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(mockRelayEnvironment, mockUserId,
      null, '132435', { encodingType: 'AMAZON_CPM', encodedValue: 'a-bid-code' }, null,
      tabId)
  })

  it('logs Amazon revenue when there is also a Prebid bid', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    window.tabforacause.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId, { advertiserId: 132435 })
    window.tabforacause.ads.slotsLoaded[slotId] = true
    window.tabforacause.ads.slotsViewable[slotId] = true

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 2.31
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([{
      cpm: mockRevenueValue
      // ... other bid info exists here
    }])

    // Mock an Amazon bid
    window.tabforacause.ads.amazonBids = {
      [slotId]: mockAmazonBidResponse({
        slotID: slotId,
        amznbid: 'a-bid-code'
      })
    }

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(mockRelayEnvironment, mockUserId,
      0.00231, '132435', { encodingType: 'AMAZON_CPM', encodedValue: 'a-bid-code' }, 'MAX',
      tabId)
  })

  it('does not include Amazon revenue when the bid is empty', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    window.tabforacause.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId, { advertiserId: 132435 })
    window.tabforacause.ads.slotsLoaded[slotId] = true
    window.tabforacause.ads.slotsViewable[slotId] = true

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 2.31
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([{
      cpm: mockRevenueValue
      // ... other bid info exists here
    }])

    // Mock an Amazon bid
    window.tabforacause.ads.amazonBids = {
      [slotId]: mockAmazonBidResponse({
        slotID: slotId,
        amznbid: '' // empty bid
      })
    }

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(mockRelayEnvironment, mockUserId,
      0.00231, '132435', null, null, tabId)
  })

  it('logs a warning, but does not throw an error or log revenue, if slot data is missing', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    window.tabforacause.ads.slotsRendered[slotId] = undefined // Missing slot data
    window.tabforacause.ads.slotsLoaded[slotId] = true
    window.tabforacause.ads.slotsViewable[slotId] = true

    // Mock console.warn
    const mockConsoleWarn = jest.fn()
    jest.spyOn(console, 'warn')
      .mockImplementationOnce(mockConsoleWarn)

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 0.172
    window.pbjs.getHighestCpmBids.mockReturnValueOnce([{
      cpm: mockRevenueValue
      // ... other bid info exists here
    }])

    // Mock no Amazon bids
    window.tabforacause.ads.amazonBids = {}

    const LogRevenueComponent = require('../LogRevenueComponent').default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).not.toHaveBeenCalled()
    expect(mockConsoleWarn).toHaveBeenCalledWith('Could not find rendered slot data for slot "my-slot-2468"')
  })
})
