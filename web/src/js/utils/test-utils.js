/* eslint-env jest */

import React from 'react'
import { shape } from 'prop-types'
import { shallow, mount } from 'enzyme'

import { BrowserRouter } from 'react-router-dom'

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
 * Create a mock bid response from Index Exchange.
 * @return {Object}
 */
export const mockIndexExchangeBidResponse = (properties = {}) => {
  return {
    slot: {
      'd-1-728x90-atf-bottom-leaderboard': [
        {
          targeting: {
            IOM: ['728x90_5000'],
            ix_id: ['_mBnLnF5V'],
          },
          price: 7000,
          adm: '',
          size: [728, 90],
          partnerId: 'IndexExchangeHtb',
        },
      ],
      'd-2-300x250-atf-middle-right_rectangle': [
        {
          targeting: {
            // Apparently, targeting values might be arrays or just keys
            some_key: 'my-cool-value123',
            ad_thing: 'thingy_abc',
          },
          price: 5000,
          adm: '_admcodehere_',
          size: [300, 250],
          partnerId: 'SomePartner',
        },
      ],
      'd-3-300x250-atf-bottom-right_rectangle': [
        {
          targeting: {
            IOM: ['300x250_5000'],
            ix_id: ['_C7VB5HUd'],
          },
          price: 3500,
          adm: '_admcodehere_',
          size: [300, 250],
          partnerId: 'IndexExchangeHtb',
        },
      ],
    },
    page: [],
    identity: {
      AdserverOrgIp: {
        data: {
          source: 'adserver.org',
          uids: [
            {
              id: '233aed36-ea6a-4a2d-aac0-d948e2a7db65',
              ext: {
                rtiPartner: 'TDID',
              },
            },
            {
              id: 'TRUE',
              ext: {
                rtiPartner: 'TDID_LOOKUP',
              },
            },
            {
              id: '2019-02-28T04:53:55',
              ext: {
                rtiPartner: 'TDID_CREATED_AT',
              },
            },
          ],
        },
      },
    },
  }
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
 * Return the default starting value of `window.searchforacause`
 * @return {Object}
 */
export const getDefaultSearchGlobal = (properties = {}) => ({
  search: {
    fetchedOnPageLoad: false,
    YPAErrorOnPageLoad: null,
  },
})

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

// https://github.com/airbnb/enzyme/issues/1112#issuecomment-383216288
export const mountWithRouter = node => {
  // Instantiate router context
  const router = {
    history: new BrowserRouter().history,
    route: {
      location: {},
      match: {},
    },
  }
  const createContext = () => ({
    context: { router },
    childContextTypes: { router: shape({}) },
  })

  return mount(node, createContext())
}

/**
 * Change the window.location object, merging with existing values.
 * @param {Object} modifiedLocation - An object with any values
 *   to modify on the window.location object.
 * @return {undefined}
 */
export const setWindowLocation = modifiedLocation => {
  const windowLocation = JSON.stringify(window.location)
  delete window.location
  Object.defineProperty(window, 'location', {
    value: Object.assign({}, JSON.parse(windowLocation), modifiedLocation),
    configurable: true,
    writable: true,
  })
}

/**
 * Set the user agent to "ReactSnap" to impersonate the
 * client that will prerender the page.
 * @return {undefined}
 */
export const impersonateReactSnapClient = () => {
  Object.defineProperty(window.navigator, 'userAgent', {
    value: 'ReactSnap',
    writable: true,
  })
}

/**
 * Set the user agent to a reasonable UA for unit test.
 * @return {undefined}
 */
export const setUserAgentToTypicalTestUserAgent = () => {
  Object.defineProperty(window.navigator, 'userAgent', {
    value:
      'Mozilla/5.0 (darwin) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/11.12.0',
    writable: true,
  })
}

/**
 * Add a div with ID "root" to the DOM.
 * @return {undefined}
 */
export const addReactRootElementToDOM = () => {
  const div = document.createElement('div')
  div.id = 'root'
  document.body.appendChild(div)
}

/**
 * Makes Enzyme's wrapper works as expected when the
 * component is wrapped in a HOC. See:
 *   https://github.com/airbnb/enzyme/issues/1395#issuecomment-362319366
 * Alternative may be to use MUI's test utils:
 *   https://material-ui.com/guides/testing/#testing
 * Related: https://github.com/mui-org/material-ui/issues/9266
 * @return {undefined}
 */
export const mountWithHOC = component => {
  return mount(shallow(component).get(0))
}

/**
 * Mock a response from window.fetch.
 * @return {Promise<Object>}
 */
export const mockFetchResponse = overrides =>
  Object.assign(
    {},
    {
      body: {},
      bodyUsed: true,
      headers: {},
      json: () => Promise.resolve({}),
      ok: true,
      redirected: false,
      status: 200,
      statusText: '',
      type: 'cors',
      url: 'https://example.com/foo/',
    },
    overrides
  )
