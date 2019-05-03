/* eslint-env jest */

import {
  VERTICAL_AD_UNIT_ID,
  VERTICAL_AD_SLOT_DOM_ID,
  SECOND_VERTICAL_AD_UNIT_ID,
  SECOND_VERTICAL_AD_SLOT_DOM_ID,
  HORIZONTAL_AD_UNIT_ID,
  HORIZONTAL_AD_SLOT_DOM_ID,
} from 'js/ads/adSettings'

// By default, we run functions in the queue immediately.
// Call this to disable that.
export const __disableAutomaticCommandQueueExecution = () => {
  window.googletag.cmd = []
}

// Run all functions in googletag.cmd.
export const __runCommandQueue = () => {
  window.googletag.cmd.forEach(cmd => cmd())
}

var mockPubadsRefresh = jest.fn()
const mockEnableSingleRequest = jest.fn()

// Set a mock function for googletag.pubads().refresh.
export const __setPubadsRefreshMock = mockFunction => {
  mockPubadsRefresh = mockFunction
}

const MockSlot = ({ adUnitPath, slotElementId }) => ({
  getAdUnitPath: () => adUnitPath,
  getSlotElementId: () => slotElementId,
  setTargeting: jest.fn(),
})

const mockSlots = [
  // Mock ad unit IDs from the adSettings mock.
  // Bottom leaderboard
  MockSlot({
    adUnitPath: HORIZONTAL_AD_UNIT_ID,
    slotElementId: HORIZONTAL_AD_SLOT_DOM_ID,
  }),
  // First (bottom) rectangle ad
  MockSlot({
    adUnitPath: VERTICAL_AD_UNIT_ID,
    slotElementId: VERTICAL_AD_SLOT_DOM_ID,
  }),
  // Second (top) rectangle ad
  MockSlot({
    adUnitPath: SECOND_VERTICAL_AD_UNIT_ID,
    slotElementId: SECOND_VERTICAL_AD_SLOT_DOM_ID,
  }),
]

const mockGetSlots = jest.fn(() => {
  return mockSlots
})
const mockSetTargeting = jest.fn()

// Mock an event fired.
export const __runEventListenerCallbacks = (eventName, ...args) => {
  eventListenerStore[eventName].forEach(f => f(...args))
}

const mockCmd = []
mockCmd.push = f => f()

const eventListenerStore = {}

export default () => {
  window.googletag = window.googletag || {
    cmd: mockCmd,
    pubads: jest.fn(() => ({
      addEventListener: (eventName, callback) => {
        if (!eventListenerStore[eventName]) {
          eventListenerStore[eventName] = []
        }
        eventListenerStore[eventName].push(callback)
      },
      getSlots: mockGetSlots,
      enableSingleRequest: mockEnableSingleRequest,
      refresh: mockPubadsRefresh,
      setTargeting: mockSetTargeting,
    })),
    defineSlot: jest.fn(() => ({
      addService: jest.fn(),
    })),
    enableServices: jest.fn(),
  }
  return window.googletag
}
