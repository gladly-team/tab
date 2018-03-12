
// Like Enzyme's `find` method, but polling to wait for
// elements to mount.
export const enzymeFindAsync = async (rootComponent, selector, maxTimeMs = 4000, intervalMs = 50) => {
  function enzymeFind () {
    return rootComponent.update().find(selector)
  }
  function timeout (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  var elems = []
  const pollIntervalMs = 100
  let remainingTimeMs = maxTimeMs
  while (remainingTimeMs > 0) {
    elems = enzymeFind()
    if (elems.length) {
      return elems
    }
    remainingTimeMs -= intervalMs
    await timeout(pollIntervalMs)
  }
  return elems
}

/**
 * Create a mock object of the googletag 'SlotOnload'. See:
 * https://developers.google.com/doubleclick-gpt/reference#googletageventsslotonloadevent
 * @param {string} slotId - A custom slot ID to override the default
 * @param {Object} properties - Values to override the default properties in the mock
 * @return {Object} An instance of `jest.fn`, a mock function
 */
export const mockGoogleTagSlotOnloadData = (slotId = 'abc-123', properties = {}) => {
  return Object.assign({}, {
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
  },
  properties)
}
