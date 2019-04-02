/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import QuantcastChoiceCMP from 'js/components/General/QuantcastChoiceCMP'

jest.mock('js/components/Dashboard/DashboardView')
jest.mock('js/utils/client-location')
jest.mock('js/components/General/QuantcastChoiceCMP')
jest.mock('js/ads/consentManagement')
jest.mock('js/analytics/withPageviewTracking', () => child => child)

beforeEach(() => {
  jest.clearAllMocks()
})

describe('App', () => {
  it('renders without error', () => {
    const App = require('js/components/App/App').default
    shallow(<App />)
  })

  it('contains the legacy MUI theme provider', async () => {
    const App = require('js/components/App/App').default
    const wrapper = shallow(<App />)
    expect(wrapper.find(V0MuiThemeProvider).exists()).toBe(true)
  })

  it('contains the MUI theme provider', async () => {
    const App = require('js/components/App/App').default
    const wrapper = shallow(<App />)
    expect(wrapper.find(MuiThemeProvider).exists()).toBe(true)
  })

  it('contains an error boundary that does not ignore errors', async () => {
    const App = require('js/components/App/App').default
    const wrapper = shallow(<App />)
    expect(wrapper.find(ErrorBoundary).exists()).toBe(true)
    expect(
      wrapper
        .find(ErrorBoundary)
        .first()
        .prop('ignoreErrors')
    ).toBe(false)
    expect(
      wrapper
        .find(ErrorBoundary)
        .first()
        .prop('brand')
    ).toEqual('tab')
  })

  it('wraps our CMP in an error boundary that ignores caught errors', async () => {
    const App = require('js/components/App/App').default
    const wrapper = shallow(<App />)
    expect(wrapper.find(ErrorBoundary).exists()).toBe(true)
    expect(
      wrapper
        .find(QuantcastChoiceCMP)
        .first()
        .parent()
        .type()
    ).toEqual(ErrorBoundary)
    expect(
      wrapper
        .find(QuantcastChoiceCMP)
        .first()
        .parent()
        .prop('ignoreErrors')
    ).toBe(true)
  })

  it('registers callback with the CMP for data consent update (when in the EU)', async () => {
    // Mock that the client is in the EU
    const isInEuropeanUnion = require('js/utils/client-location')
      .isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    const App = require('js/components/App/App').default
    const wrapper = shallow(<App />)
    await wrapper.instance().componentDidMount()
    wrapper.update()
    const registerConsentCallback = require('js/ads/consentManagement')
      .registerConsentCallback
    expect(registerConsentCallback).toHaveBeenCalled()
  })

  it('does not register callback with the CMP for data consent update (when not in the EU)', async () => {
    // Mock that the client is not in the EU
    const isInEuropeanUnion = require('js/utils/client-location')
      .isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(false)

    const App = require('js/components/App/App').default
    const wrapper = shallow(<App />)
    await wrapper.instance().componentDidMount()
    wrapper.update()
    const registerConsentCallback = require('js/ads/consentManagement')
      .registerConsentCallback
    expect(registerConsentCallback).not.toHaveBeenCalled()
  })

  it("saves to localStorage that there is updated consent data when the CMP says it's been updated", async () => {
    // Mock the callback registration so we can trigger it ourselves
    var cmpCallback
    const registerConsentCallback = require('js/ads/consentManagement')
      .registerConsentCallback
    registerConsentCallback.mockImplementationOnce(cb => {
      cmpCallback = cb
    })

    const saveConsentUpdateEventToLocalStorage = require('js/ads/consentManagement')
      .saveConsentUpdateEventToLocalStorage

    // Mock that the client is in the EU
    const isInEuropeanUnion = require('js/utils/client-location')
      .isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)
    const App = require('js/components/App/App').default
    const wrapper = shallow(<App />)
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
    const isInEuropeanUnion = require('js/utils/client-location')
      .isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)
    const App = require('js/components/App/App').default
    const wrapper = shallow(<App />)
    await wrapper.instance().componentDidMount()
    wrapper.update()

    const unregisterConsentCallback = require('js/ads/consentManagement')
      .unregisterConsentCallback
    expect(unregisterConsentCallback).not.toHaveBeenCalled()
    wrapper.unmount()
    expect(unregisterConsentCallback).toHaveBeenCalled()
  })
})
