/* eslint-env jest */
import React from 'react'
import PropTypes from 'prop-types'

// A gist with mock for Relay Modern:
// https://gist.github.com/robrichard/ad838e599d828a89978f54faaa2070a8

const RelayMock = jest.genMockFromModule('react-relay')

/*
  Mock createFragmentContainer, createRefetchContainer, and
  createPaginationContainer functionality.
*/

const relayChildContextTypes = {
  relay: PropTypes.object
}

const relayEnvironment = {
  lookup: jest.fn()
}

const relayContext = {
  relay: {
    environment: relayEnvironment,
    variables: {}
  }
}

const relayFragmentProps = {
  relay: {
    environment: relayEnvironment
  }
}

const relayRefetchProps = {
  relay: {
    environment: relayEnvironment,
    refetch: jest.fn()
  }
}

const relayPaginationProps = {
  relay: {
    environment: relayEnvironment,
    hasMore: jest.fn(),
    loadMore: jest.fn(),
    isLoading: jest.fn()
  }
}

function makeRelayWrapper (relayProps) {
  return function (Comp) {
    class HOC extends React.Component {
      getChildContext () {
        return relayContext
      }

      render () {
        return <Comp {...this.props} {...relayProps} />
      }
    }

    HOC.childContextTypes = relayChildContextTypes
    return HOC
  }
}

RelayMock.createFragmentContainer = makeRelayWrapper(relayFragmentProps)
RelayMock.createRefetchContainer = makeRelayWrapper(relayRefetchProps)
RelayMock.createPaginationContainer = makeRelayWrapper(relayPaginationProps)

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

RelayMock.QueryRenderer = MockComponent

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
RelayMock.QueryRenderer.__setQueryResponse = mockResponse => {
  queryRendererResponse = mockResponse
}

module.exports = RelayMock
