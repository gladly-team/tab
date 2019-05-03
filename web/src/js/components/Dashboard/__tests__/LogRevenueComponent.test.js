/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { getTabGlobal } from 'js/utils/utils'
import {
  deleteTabGlobal,
  mockAmazonBidResponse,
  mockGoogleTagSlotRenderEndedData,
} from 'js/utils/test-utils'
import getAmazonTag from 'js/ads/amazon/getAmazonTag'
import getGoogleTag, {
  __disableAutomaticCommandQueueExecution,
  __runCommandQueue,
  __runEventListenerCallbacks,
} from 'js/ads/google/getGoogleTag'
import LogUserRevenueMutation from 'js/mutations/LogUserRevenueMutation'

jest.mock('js/mutations/LogUserRevenueMutation')
jest.mock('js/ads/amazon/getAmazonTag')
jest.mock('js/ads/google/getGoogleTag')

beforeEach(() => {
  // Mock googletag
  delete window.googletag
  window.googletag = getGoogleTag()

  // Mock pbjs
  delete window.pbjs
  window.pbjs = {
    getHighestCpmBids: jest.fn(),
  }

  // Mock apstag
  delete window.apstag
  window.apstag = getAmazonTag

  window.pbjs.getHighestCpmBids.mockReturnValue({})
})

afterEach(() => {
  jest.clearAllMocks()
  delete window.googletag
  delete window.pbjs
  delete window.apstag
  deleteTabGlobal()
})

describe('LogRevenueComponent', function() {
  it('renders without error and does not have any DOM elements', () => {
    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
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
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    // We use "slotsViewable" as the measure of ads already loaded
    // tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 0.172
    window.pbjs.getHighestCpmBids.mockReturnValue([
      {
        cpm: mockRevenueValue,
        size: '300x250',
        // ... other bid info exists here
      },
    ])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock no Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {}

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.000172,
      '132435',
      '300x250',
      null,
      null,
      tabId,
      adUnitCode
    )

    // It should mark this slot as logged
    expect(tabGlobal.ads.slotsAlreadyLoggedRevenue[slotId]).toBe(true)
  })

  it('does not log revenue for slots that have already been logged', () => {
    // Mark an ad slot as loaded
    const slotId = 'abc-123'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mark the ad slot as having already been logged
    tabGlobal.ads.slotsAlreadyLoggedRevenue[slotId] = true

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 0.172
    window.pbjs.getHighestCpmBids.mockReturnValue([
      {
        cpm: mockRevenueValue,
        size: '300x250',
        // ... other bid info exists here
      },
    ])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock no Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {}

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
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
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock no Prebid bids for the slot
    window.pbjs.getHighestCpmBids.mockReturnValue([])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock no Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {}

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )

    expect(LogUserRevenueMutation).not.toHaveBeenCalled()
  })

  it('rounds excessively long decimals in Prebid revenue value', () => {
    // Mark an ad slot as loaded
    const slotId = 'abc-123'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 9876543,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 0.1234567890123456789
    window.pbjs.getHighestCpmBids.mockReturnValue([
      {
        cpm: mockRevenueValue,
        size: '300x250',
        // ... other bid info exists here
      },
    ])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock no Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {}

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )

    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.000123456789012,
      '9876543',
      '300x250',
      null,
      null,
      tabId,
      adUnitCode
    )
  })

  it('after mount, logs revenue when GPT fires a "slot rendered" event', () => {
    const slotId = 'xyz-987'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered = {}

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 2.31
    window.pbjs.getHighestCpmBids.mockReturnValue([
      {
        cpm: mockRevenueValue,
        size: '300x250',
        // ... other bid info exists here
      },
    ])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock no Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {}

    // We'll run the googletag command queue manually.
    __disableAutomaticCommandQueueExecution()

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )

    // Should not have logged anything yet
    expect(LogUserRevenueMutation).not.toHaveBeenCalled()

    // Run the queued googletag commands
    __runCommandQueue()
    __runEventListenerCallbacks(
      'slotRenderEnded',
      mockGoogleTagSlotRenderEndedData(slotId, adUnitCode, {
        advertiserId: 159260,
      })
    )

    // Should have logged revenue after the slot loaded
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.00231,
      '159260',
      '300x250',
      null,
      null,
      tabId,
      adUnitCode
    )
  })

  it('defaults to 99 (Google Adsense) DFP Advertiser ID when the advertiser ID does not exist', () => {
    const slotId = 'xyz-987'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered = {}

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 2.31
    window.pbjs.getHighestCpmBids.mockReturnValue([
      {
        cpm: mockRevenueValue,
        size: '300x250',
        // ... other bid info exists here
      },
    ])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock no Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {}

    // We'll run the googletag command queue manually.
    __disableAutomaticCommandQueueExecution()

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )

    // Should not have logged anything yet
    expect(LogUserRevenueMutation).not.toHaveBeenCalled()

    // Run the queued googletag commands
    __runCommandQueue()

    __runEventListenerCallbacks(
      'slotRenderEnded',
      mockGoogleTagSlotRenderEndedData(slotId, adUnitCode, {
        advertiserId: null,
        campaignId: null,
        creativeId: null,
      })
    )

    // Should have logged revenue after the slot loaded
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.00231,
      '99',
      '300x250',
      null,
      null,
      tabId,
      adUnitCode
    )
  })

  it('logs Amazon revenue when there are no Prebid bids', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock no Prebid bids for the slot
    window.pbjs.getHighestCpmBids.mockReturnValue([])

    // Mock an Amazon bid
    tabGlobal.ads.amazonBids = {
      [slotId]: mockAmazonBidResponse({
        slotID: slotId,
        amznbid: 'a-bid-code',
        size: '728x90',
      }),
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0,
      '132435',
      null,
      {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'a-bid-code',
        adSize: '728x90',
      },
      null,
      tabId,
      adUnitCode
    )
  })

  it('logs Amazon revenue when there is also a Prebid bid', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 2.31
    window.pbjs.getHighestCpmBids.mockReturnValue([
      {
        cpm: mockRevenueValue,
        size: '728x90',
        // ... other bid info exists here
      },
    ])

    // Mock an Amazon bid
    tabGlobal.ads.amazonBids = {
      [slotId]: mockAmazonBidResponse({
        slotID: slotId,
        amznbid: 'a-bid-code',
        size: '728x90',
      }),
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.00231,
      '132435',
      '728x90',
      {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'a-bid-code',
        adSize: '728x90',
      },
      'MAX',
      tabId,
      adUnitCode
    )
  })

  it('does not include Amazon revenue when the bid is empty', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 2.31
    window.pbjs.getHighestCpmBids.mockReturnValue([
      {
        cpm: mockRevenueValue,
        size: '728x90',
        // ... other bid info exists here
      },
    ])

    // Mock an Amazon bid
    tabGlobal.ads.amazonBids = {
      [slotId]: mockAmazonBidResponse({
        slotID: slotId,
        amznbid: '', // empty bid
      }),
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.00231,
      '132435',
      '728x90',
      null,
      null,
      tabId,
      adUnitCode
    )
  })

  it('logs Index Exchange revenue when there are no other bids', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock no Prebid bids for the slot
    window.pbjs.getHighestCpmBids.mockReturnValue([])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock some Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {
      includedInAdServerRequest: true,
      [slotId]: [
        {
          targeting: {
            IOM: ['728x90_5000'],
            ix_id: ['_mBnLnF5V'],
          },
          price: 730,
          adm: '',
          size: [728, 90],
          partnerId: 'IndexExchangeHtb',
        },
      ],
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.0073,
      '132435',
      '728x90',
      null,
      null,
      tabId,
      adUnitCode
    )
  })

  it('selects the highest-value Index Exchange revenue, if there are multiple IX bids', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock no Prebid bids for the slot
    window.pbjs.getHighestCpmBids.mockReturnValue([])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock some Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {
      includedInAdServerRequest: true,
      [slotId]: [
        {
          targeting: {
            IOM: ['728x90_5000'],
            ix_id: ['_mBnLnF5V'],
          },
          price: 730,
          adm: '',
          size: [728, 90],
          partnerId: 'IndexExchangeHtb',
        },
        {
          targeting: {
            IOM: ['728x90_5000'],
            ix_id: ['_mBnLnF5V'],
          },
          price: 120,
          adm: '',
          size: [728, 90],
          partnerId: 'IndexExchangeHtb',
        },
        {
          targeting: {
            IOM: ['728x90_5000'],
            ix_id: ['_mBnLnF5V'],
          },
          price: 990, // winning bid
          adm: '',
          size: [728, 90],
          partnerId: 'IndexExchangeHtb',
        },
      ],
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.0099,
      '132435',
      '728x90',
      null,
      null,
      tabId,
      adUnitCode
    )
  })

  it('does not log Index Exchange revenue when the IX bids did not return in time for the auction', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock no Prebid bids for the slot
    window.pbjs.getHighestCpmBids.mockReturnValue([])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock some Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {
      includedInAdServerRequest: false, // is not part of the auction
      [slotId]: [
        {
          targeting: {
            IOM: ['728x90_5000'],
            ix_id: ['_mBnLnF5V'],
          },
          price: 730,
          adm: '',
          size: [728, 90],
          partnerId: 'IndexExchangeHtb',
        },
      ],
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).not.toHaveBeenCalled()
  })

  it('rounds excessively long decimals in the Index Exchange revenue value', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock no Prebid bids for the slot
    window.pbjs.getHighestCpmBids.mockReturnValue([])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock some Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {
      includedInAdServerRequest: true,
      [slotId]: [
        {
          targeting: {
            IOM: ['728x90_5000'],
            ix_id: ['_mBnLnF5V'],
          },
          price: 120.1234567890123456789,
          adm: '',
          size: [728, 90],
          partnerId: 'IndexExchangeHtb',
        },
      ],
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.00120123456789,
      '132435',
      '728x90',
      null,
      null,
      tabId,
      adUnitCode
    )
  })

  it('passes a null ad size if the Index Exchange size value does not exist', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock no Prebid bids for the slot
    window.pbjs.getHighestCpmBids.mockReturnValue([])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock some Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {
      includedInAdServerRequest: true,
      [slotId]: [
        {
          targeting: {
            IOM: ['728x90_5000'],
            ix_id: ['_mBnLnF5V'],
          },
          price: 310,
          adm: '',
          size: null, // ad size is missing
          partnerId: 'IndexExchangeHtb',
        },
      ],
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.0031,
      '132435',
      null,
      null,
      null,
      tabId,
      adUnitCode
    )
  })

  it('passes a null ad size if the Index Exchange size value is an array with more than two values', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock no Prebid bids for the slot
    window.pbjs.getHighestCpmBids.mockReturnValue([])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock some Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {
      includedInAdServerRequest: true,
      [slotId]: [
        {
          targeting: {
            IOM: ['728x90_5000'],
            ix_id: ['_mBnLnF5V'],
          },
          price: 310,
          adm: '',
          size: [728, 90, 2008], // ad size is malformed
          partnerId: 'IndexExchangeHtb',
        },
      ],
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.0031,
      '132435',
      null,
      null,
      null,
      tabId,
      adUnitCode
    )
  })

  it('logs the Index Exchange revenue and ad size when it is higher than the Prebid revenue', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    window.pbjs.getHighestCpmBids.mockReturnValue([
      {
        cpm: 1.2,
        size: '300x250',
        // ... other bid info exists here
      },
    ])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock some Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {
      includedInAdServerRequest: true,
      [slotId]: [
        {
          targeting: {
            IOM: ['728x90_5000'],
            ix_id: ['_mBnLnF5V'],
          },
          price: 730,
          adm: '',
          size: [728, 90],
          partnerId: 'IndexExchangeHtb',
        },
      ],
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.0073,
      '132435',
      '728x90',
      null,
      null,
      tabId,
      adUnitCode
    )
  })

  it('logs the Prebid revenue and ad size when it is higher than the Index Exchange revenue', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    window.pbjs.getHighestCpmBids.mockReturnValue([
      {
        cpm: 12.8,
        size: '300x250',
        // ... other bid info exists here
      },
    ])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock some Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {
      includedInAdServerRequest: true,
      [slotId]: [
        {
          targeting: {
            IOM: ['728x90_5000'],
            ix_id: ['_mBnLnF5V'],
          },
          price: 730,
          adm: '',
          size: [728, 90],
          partnerId: 'IndexExchangeHtb',
        },
      ],
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.0128,
      '132435',
      '300x250',
      null,
      null,
      tabId,
      adUnitCode
    )
  })

  it('logs the Prebid revenue and ad size when the Index Exchange bid is missing revenue data', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    window.pbjs.getHighestCpmBids.mockReturnValue([
      {
        cpm: 12.8,
        size: '300x250',
        // ... other bid info exists here
      },
    ])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock some Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {
      includedInAdServerRequest: true,
      [slotId]: [
        {
          targeting: {
            IOM: ['728x90_5000'],
            ix_id: ['_mBnLnF5V'],
          },
          price: null, // this is unexpected
          adm: '',
          size: [728, 90],
          partnerId: 'IndexExchangeHtb',
        },
      ],
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.0128,
      '132435',
      '300x250',
      null,
      null,
      tabId,
      adUnitCode
    )
  })

  it('logs the Prebid revenue when the Index Exchange slot is missing any bid data', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    window.pbjs.getHighestCpmBids.mockReturnValue([
      {
        cpm: 12.8,
        size: '300x250',
        // ... other bid info exists here
      },
    ])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock some Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {
      includedInAdServerRequest: true,
      // Missing slot data
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.0128,
      '132435',
      '300x250',
      null,
      null,
      tabId,
      adUnitCode
    )
  })

  it('logs a warning, but does not throw an error or log revenue, if slot data is missing', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = undefined // Missing slot data
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock console.warn
    const mockConsoleWarn = jest.fn()
    jest.spyOn(console, 'warn').mockImplementationOnce(mockConsoleWarn)

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 0.172
    window.pbjs.getHighestCpmBids.mockReturnValue([
      {
        cpm: mockRevenueValue,
        size: '300x250',
        // ... other bid info exists here
      },
    ])

    // Mock no Amazon bids
    tabGlobal.ads.amazonBids = {}

    // Mock no Index Exchange bids
    tabGlobal.ads.indexExchangeBids = {}

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).not.toHaveBeenCalled()
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      'Could not find rendered slot data for slot "my-slot-2468"'
    )
  })

  it('logs bids even if ad sizes are undefined for some reason', () => {
    // Mark an ad slot as loaded
    const slotId = 'my-slot-2468'
    const adUnitCode = '/some/ad-unit/'
    const tabGlobal = getTabGlobal()
    tabGlobal.ads.slotsRendered[slotId] = mockGoogleTagSlotRenderEndedData(
      slotId,
      adUnitCode,
      {
        advertiserId: 132435,
      }
    )
    tabGlobal.ads.slotsLoaded[slotId] = true
    tabGlobal.ads.slotsViewable[slotId] = true

    // Mock a Prebid bid value for the slot
    const mockRevenueValue = 2.31
    window.pbjs.getHighestCpmBids.mockReturnValue([
      {
        cpm: mockRevenueValue,
        size: undefined,
        // ... other bid info exists here
      },
    ])

    // Mock an Amazon bid
    tabGlobal.ads.amazonBids = {
      [slotId]: mockAmazonBidResponse({
        slotID: slotId,
        amznbid: 'a-bid-code',
        size: undefined,
      }),
    }

    const LogRevenueComponent = require('js/components/Dashboard/LogRevenueComponent')
      .default
    const mockUserId = 'abcdefghijklmno'
    const tabId = '712dca1a-3705-480f-95ff-314be86a2936'
    const mockRelayEnvironment = {}
    shallow(
      <LogRevenueComponent
        user={{
          id: mockUserId,
        }}
        tabId={tabId}
        relay={{ environment: mockRelayEnvironment }}
      />
    )
    expect(LogUserRevenueMutation).toHaveBeenCalledWith(
      mockRelayEnvironment,
      mockUserId,
      0.00231,
      '132435',
      undefined,
      {
        encodingType: 'AMAZON_CPM',
        encodedValue: 'a-bid-code',
        adSize: undefined,
      },
      'MAX',
      tabId,
      adUnitCode
    )
  })
})
