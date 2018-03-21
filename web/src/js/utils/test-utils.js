
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
 * Create a mock object of the googletag 'SlotRenderEnded'. See:
 * https://developers.google.com/doubleclick-gpt/reference#googletag.events.SlotRenderEndedEvent
 * @param {string} slotId - A custom slot ID to override the default
 * @param {Object} properties - Values to override the default properties in the mock
 * @return {Object}
 */
export const mockGoogleTagSlotRenderEndedData = (slotId = 'abc-123', properties = {}) => {
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

/**
 * Create a mock bid response from Amazon's apstag.
 * @param {Object} properties - Values to override the default properties in the mock
 * @return {Object}
 */
export const mockAmazonBidResponse = (properties = {}) => {
  return Object.assign({}, {
    amznbid: '1',
    amzniid: 'some-id',
    amznp: '1',
    amznsz: '0x0',
    size: '0x0',
    slotID: 'div-gpt-ad-123456789-0'
  },
  properties)
}

/**
 * Return the default starting value of `window.tabforacause`
 * @return {Object}
 */
export const getDefaultTabGlobal = (properties = {}) => {
  return {
    ads: {
      amazonBids: {},
      slotsLoaded: {},
      slotsAlreadyLoggedRevenue: {}
    }
  }
}
