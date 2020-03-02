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
 * Delete `window.tabforacause`.
 * @return {undefined}
 */
export const deleteTabGlobal = () => {
  delete window.tabforacause
}

/**
 * Return the default starting value of `window.searchforacause`
 * @return {Object}
 */
export const getDefaultSearchGlobal = () => ({
  search: {
    fetchedOnPageLoad: false,
    YPAErrorOnPageLoad: null,
  },
  queryRequest: {
    status: 'NONE',
    displayedResults: false,
    query: null,
    responseData: null,
  },
  extension: {
    isInstalled: false,
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
export const runAsyncTimerLoops = async (numLoops = 2) => {
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
