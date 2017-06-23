/* global jest */
import React from 'react'

export default function relayWrap (component, relayOptions) {
  relayOptions = relayOptions || {}
  const variables = relayOptions.variables || {}
  let initialVariables = {}
  // TODO prepareVariables
  if (component.type && component.type.getRelaySpecs) {
    initialVariables = component.type.getRelaySpecs().initialVariables
  }

  const relaySpec = {
    forceFetch: jest.genMockFn(),
    getPendingTransactions: jest.genMockFn().mockImplementation(() => relayOptions.pendingTransactions),
    hasOptimisticUpdate: jest.genMockFn().mockImplementation(() => relayOptions.hasOptimisticUpdate),
    route: relayOptions.route || { name: 'MockRoute', path: '/mock' },
    setVariables: jest.fn().mockImplementation(function (variables, fn) {
      this.variables = {
        ...this.variables,
        ...variables
      }
      if (fn) {
        fn()
      }
    }),
    variables: {
      ...initialVariables,
      ...variables
    }
  }
  return React.cloneElement(component, { relay: relaySpec })
}
