/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'

jest.mock('js/utils/client-location')
jest.mock('js/ads/consentManagement')
jest.mock('js/analytics/withPageviewTracking', () => child => child)

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
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    const App = require('../App').default
    const wrapper = shallow(
      <App />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()
    const registerConsentCallback = require('js/ads/consentManagement').registerConsentCallback
    expect(registerConsentCallback).toHaveBeenCalled()
  })

  it('does not register callback with the CMP for data consent update (when not in the EU)', async () => {
    // Mock that the client is not in the EU
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(false)

    const App = require('../App').default
    const wrapper = shallow(
      <App />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()
    const registerConsentCallback = require('js/ads/consentManagement').registerConsentCallback
    expect(registerConsentCallback).not.toHaveBeenCalled()
  })

  it('saves to localStorage that there is updated consent data when the CMP says it\'s been updated', async () => {
    // Mock the callback registration so we can trigger it ourselves
    var cmpCallback
    const registerConsentCallback = require('js/ads/consentManagement').registerConsentCallback
    registerConsentCallback.mockImplementationOnce(cb => {
      cmpCallback = cb
    })

    const saveConsentUpdateEventToLocalStorage = require('js/ads/consentManagement')
      .saveConsentUpdateEventToLocalStorage

    // Mock that the client is in the EU
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)
    const App = require('../App').default
    const wrapper = shallow(
      <App />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()

    // We should not have done anything yet
    expect(saveConsentUpdateEventToLocalStorage).not.toHaveBeenCalled()

    // Mock the CMP's callback for when consent data has changed
    cmpCallback('some-consent-string', true)
    expect(saveConsentUpdateEventToLocalStorage).toHaveBeenCalledTimes(1)
  })

  it('unregisters its callback when unmounting', async () => {
    expect.assertions(2)

    // Mock that the client is in the EU
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)
    const App = require('../App').default
    const wrapper = shallow(
      <App />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()

    const unregisterConsentCallback = require('js/ads/consentManagement').unregisterConsentCallback
    expect(unregisterConsentCallback).not.toHaveBeenCalled()
    wrapper.unmount()
    expect(unregisterConsentCallback).toHaveBeenCalled()
  })
})
