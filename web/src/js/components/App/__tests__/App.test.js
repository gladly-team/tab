/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import {
  // getConsentString,
  // hasGlobalConsent,
  registerConsentCallback
} from 'ads/consentManagement'

jest.mock('utils/client-location')

jest.mock('ads/consentManagement')
jest.mock('analytics/withPageviewTracking', () => child => child)

beforeEach(() => {
  jest.clearAllMocks()
})

describe('App', () => {
  it('renders without error', () => {
    const App = require('../App').default
    shallow(
      <App />
    )
  })

  it('registers callback with the CMP for data consent update (when in the EU)', async () => {
    // Mock that the client is in the EU
    const isInEuropeanUnion = require('utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    const App = require('../App').default
    const wrapper = shallow(
      <App />
    )
    await wrapper.instance().componentWillMount()
    wrapper.update()
    expect(registerConsentCallback).toHaveBeenCalled()
  })

  it('does not register callback with the CMP for data consent update (when not in the EU)', async () => {
    // Mock that the client is not in the EU
    const isInEuropeanUnion = require('utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(false)

    const App = require('../App').default
    const wrapper = shallow(
      <App />
    )
    await wrapper.instance().componentWillMount()
    wrapper.update()
    expect(registerConsentCallback).not.toHaveBeenCalled()
  })
})
