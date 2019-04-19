/* eslint-env jest */

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
    pubads: () => ({
      addEventListener: (eventName, callback) => {
        if (!eventListenerStore[eventName]) {
          eventListenerStore[eventName] = []
        }
        eventListenerStore[eventName].push(callback)
      },
      enableSingleRequest: mockEnableSingleRequest,
      refresh: mockPubadsRefresh,
      setTargeting: mockSetTargeting,
    }),
    defineSlot: jest.fn(() => ({
      addService: jest.fn(),
    })),
    enableServices: jest.fn(),
  }
  return window.googletag
}
