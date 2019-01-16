/* eslint-env jest */

var bidsBackHandler = () => {}

// By default, we mock that bid responses return immediately,
// which resolves the promise for tests. Call this to disable
// automatic bid responses.
export const __disableAutomaticBidResponses = () => {
  window.pbjs.requestBids = jest.fn(requestBidsSettings => {
    bidsBackHandler = requestBidsSettings.bidsBackHandler
  })
}

// Mock that Prebid returns bids.
export const __runBidsBack = (bidResponses = {}) => {
  bidsBackHandler(bidResponses)
}

// By default, we run functions in the queue immediately.
// Call this to disable that.
export const __disableAutomaticQueExecution = () => {
  window.pbjs.que = []
}

// Run all functions in pbjs.que.
export const __runQue = () => {
  window.pbjs.que.forEach(cmd => cmd())
}

const mockQue = []
mockQue.push = f => f()

export default () => {
  window.pbjs = window.pbjs || {
    que: mockQue,
    setConfig: jest.fn(),
    bidderSettings: {},
    addAdUnits: jest.fn(),
    requestBids: jest.fn(requestBidsSettings => {
      requestBidsSettings.bidsBackHandler({})
    }),
    setTargetingForGPTAsync: jest.fn(),
  }
  return window.pbjs
}
