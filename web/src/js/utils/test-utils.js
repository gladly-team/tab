/* eslint-env jest */

import React from 'react'

// Like Enzyme's `find` method, but polling to wait for
// elements to mount.
export const enzymeFindAsync = async (
  rootComponent,
  selector,
  maxTimeMs = 4000,
  intervalMs = 50
) => {
  function enzymeFind() {
    return rootComponent.update().find(selector)
  }
  function timeout(ms) {
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
 * Create a mock object of the googletag 'SlotRenderEnded' event. See:
 * https://developers.google.com/doubleclick-gpt/reference#googletag.events.SlotRenderEndedEvent
 * @param {string} slotId - A custom slot ID to override the default
 * @param {string} adUnitCode - A custom ad unit code to override the default
 * @param {Object} properties - Values to override the default properties in the mock
 * @return {Object}
 */
export const mockGoogleTagSlotRenderEndedData = (
  slotId = 'abc-123',
  adUnitCode = '/123456/some-ad/',
  properties = {}
) => {
  return Object.assign(
    {},
    {
      // https://developers.google.com/doubleclick-gpt/reference#googletagslot
      slot: {
        getSlotElementId: () => slotId,
        getAdUnitPath: () => adUnitCode,
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
      sourceAgnosticLineItemId: null,
    },
    properties
  )
}

/**
 * Create a mock object of the googletag 'ImpressionViewable' event. See:
 * https://developers.google.com/doubleclick-gpt/reference#googletageventsimpressionviewableevent
 * @param {string} slotId - A custom slot ID to override the default
 * @param {Object} properties - Values to override the default properties in the mock
 * @return {Object}
 */
export const mockGoogleTagImpressionViewableData = (
  slotId = 'abc-123',
  properties = {}
) => {
  return Object.assign(
    {},
    {
      // https://developers.google.com/doubleclick-gpt/reference#googletagslot
      slot: {
        getSlotElementId: () => slotId,
        // ... other methods here
      },
      serviceName: 'something',
    },
    properties
  )
}

/**
 * Create a mock object of the googletag 'SlotOnload' event. See:
 * https://developers.google.com/doubleclick-gpt/reference#googletageventsslotonloadevent
 * @param {string} slotId - A custom slot ID to override the default
 * @param {Object} properties - Values to override the default properties in the mock
 * @return {Object}
 */
export const mockGoogleTagSlotOnloadData = (
  slotId = 'abc-123',
  properties = {}
) => {
  return Object.assign(
    {},
    {
      // https://developers.google.com/doubleclick-gpt/reference#googletagslot
      slot: {
        getSlotElementId: () => slotId,
        // ... other methods here
      },
      serviceName: 'something',
    },
    properties
  )
}

/**
 * Create a mock bid response from Amazon's apstag.
 * @param {Object} properties - Values to override the default properties in the mock
 * @return {Object}
 */
export const mockAmazonBidResponse = (properties = {}) => {
  return Object.assign(
    {},
    {
      amznbid: '1',
      amzniid: 'some-id',
      amznp: '1',
      amznsz: '0x0',
      size: '0x0',
      slotID: 'div-gpt-ad-123456789-0',
    },
    properties
  )
}

/**
 * Return the default starting value of `window.tabforacause`
 * @return {Object}
 */
export const getDefaultTabGlobal = (properties = {}) => {
  return {
    ads: {
      // Bid objects returned from apstag
      // Key: slot ID
      // Value: bid object
      amazonBids: {},

      // Objects from googletag's "slotRenderEnded" event. This event fires
      // before the "slotOnload" event; i.e., before the actual creative loads.
      // Key: slot ID
      // Value: https://developers.google.com/doubleclick-gpt/reference#googletageventsslotrenderendedevent
      slotsRendered: {},

      // Marking which slots have fired googletag's "impressionViewable" event.
      // See:
      // https://developers.google.com/doubleclick-gpt/reference#googletageventsimpressionviewableevent
      // Key: slot ID
      // Value: `true`
      slotsViewable: {},

      // Marking which slots have fired googletag's "slotOnload" event;
      // i.e., which slots have loaded creative. See:
      // https://developers.google.com/doubleclick-gpt/reference#googletag.events.SlotRenderEndedEvent
      // Key: slot ID
      // Value: `true`
      slotsLoaded: {},

      // Marking which slots have had their revenue logged.
      // Key: slot ID
      // Value: `true`
      slotsAlreadyLoggedRevenue: {},
    },
    featureFlags: {},
  }
}

/**
 * Create a mock React component for testing. The component will render
 * any React.children.
 * @param {String} componentName - The value of the component's displayName;
 *   typically should be the name of the component class or file name.
 * @param {Object|null} childProps - Any props that should be passed on to
 *   all children. If provided, children will be cloned with these props.
 * @return {function} The mock component
 */
export const createMockReactComponent = (componentName, childProps = null) => {
  const MockComponent = props => {
    var children
    if (props) {
      children = childProps
        ? React.Children.map(props.children, child =>
            React.cloneElement(child, childProps)
          )
        : props.children
    }
    return <span>{children}</span>
  }
  MockComponent.displayName = componentName || 'MyMockComponent'
  return MockComponent
}

/**
 * Flush the Promise resolution queue. See:
 * https://github.com/facebook/jest/issues/2157
 * @return {Promise<undefined>}
 */
export const flushAllPromises = async () => {
  await new Promise(resolve => setImmediate(resolve))
}

/**
 * Flush the Promise resolution queue, then all timers, and
 * repeat the given number of times. This is useful for
 * recursive async code that sets new timers.
 * https://github.com/facebook/jest/issues/2157
 * @return {Promise<undefined>}
 */
export const runAsyncTimerLoops = async numLoops => {
  for (var i = 0; i < numLoops; i++) {
    await flushAllPromises()
    jest.runAllTimers()
  }
}
