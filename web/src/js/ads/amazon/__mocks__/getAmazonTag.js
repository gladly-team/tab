/* eslint-env jest */

var bidsBackHandler = () => {}

// By default, we mock that bid responses return immediately,
// which resolves the promise for tests. Call this to disable
// automatic bid responses.
export const __disableAutomaticBidResponses = () => {
  window.apstag.fetchBids = jest.fn((config, bidsBackCallback) => {
    bidsBackHandler = bidsBackCallback
  })
}

// Mock that Amazon returns bids.
export const __runBidsBack = (bidResponses = {}) => {
  bidsBackHandler(bidResponses)
}

export default () => {
  window.apstag = window.apstag || {
    init: jest.fn(),
    fetchBids: jest.fn((config, bidsBackCallback) => {
      bidsBackCallback()
    }),
    setDisplayBids: jest.fn()
  }
  return window.apstag
}
