/* eslint-env jest */
import React from 'react'

const RelayCompatMock = jest.genMockFromModule('react-relay/compat')

/* Mock QueryRenderer functionality */

// The default mock response used to call the QueryRenderer's
// `render` prop.
var queryRendererResponse = {
  error: null,
  props: null,
  retry: jest.fn()
}

// The mock QueryRenderer component, which will call the
// `render` prop on mount and render the response as child
// elements.
const MockComponent = props => {
  const children = props.render ? props.render(queryRendererResponse) : null
  return <span>{children}</span>
}
MockComponent.displayName = 'QueryRenderer'

RelayCompatMock.QueryRenderer = MockComponent

/**
 * Set the mock response value passed as an argument to the mock
 * QueryRenderer's `render` function prop. Set this before rendering
 * the component.
 * @param {Object} mockResponse
 * @param {Object|null} mockResponse.error - Any errors returned from
 *   the mock Relay query
 * @param {Object|null} mockResponse.props - Any props returned from
 *   the mock Relay query. These should match the form expected from
 *   the QueryRenderer's `query` prop.
 * @param {function} mockResponse.retry - A function that, if called,
 *   would retry the query.
 * @return {undefined}
 */
RelayCompatMock.QueryRenderer.__setQueryResponse = mockResponse => {
  queryRendererResponse = mockResponse
}

module.exports = RelayCompatMock
