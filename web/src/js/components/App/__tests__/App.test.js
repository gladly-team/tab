/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Helmet } from 'react-helmet'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import QuantcastChoiceCMP from 'js/components/General/QuantcastChoiceCMP'
import { requestEUAdPersonalization } from 'js/utils/feature-flags'

jest.mock('js/components/Dashboard/DashboardView')
jest.mock('js/utils/client-location')
jest.mock('js/components/General/QuantcastChoiceCMP')
jest.mock('js/ads/consentManagement')
jest.mock('js/analytics/withPageviewTracking', () => child => child)
jest.mock('js/assets/logos/favicon.ico', () => '/tab-favicon.png')
jest.mock('js/utils/feature-flags')

const getMockProps = () => ({
  location: {
    pathname: '/newtab/',
    search: '',
  },
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('App.js: general', () => {
  it('renders without error', () => {
    const App = require('js/components/App/App').default
    const mockProps = getMockProps()
    shallow(<App {...mockProps} />)
  })

  it('contains the legacy MUI theme provider', async () => {
    const App = require('js/components/App/App').default
    const mockProps = getMockProps()
    const wrapper = shallow(<App {...mockProps} />)
    expect(wrapper.find(V0MuiThemeProvider).exists()).toBe(true)
  })

  it('contains the MUI theme provider', async () => {
    const App = require('js/components/App/App').default
    const mockProps = getMockProps()
    const wrapper = shallow(<App {...mockProps} />)
    expect(wrapper.find(MuiThemeProvider).exists()).toBe(true)
  })

  it('contains an error boundary that does not ignore errors', async () => {
    const App = require('js/components/App/App').default
    const mockProps = getMockProps()
    const wrapper = shallow(<App {...mockProps} />)
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

  it('sets the the favicon with react-helmet', async () => {
    const App = require('js/components/App/App').default
    const mockProps = getMockProps()
    const wrapper = shallow(<App {...mockProps} />)
    expect(
      wrapper
        .find(Helmet)
        .find('link')
        .first()
        .prop('rel')
    ).toEqual('icon')
    expect(
      wrapper
        .find(Helmet)
        .find('link')
        .first()
        .prop('href')
    ).toEqual('/tab-favicon.png')
  })

  it('sets the the titleTemplate and defaultTitle with react-helmet', async () => {
    const App = require('js/components/App/App').default
    const mockProps = getMockProps()
    const wrapper = shallow(<App {...mockProps} />)
    expect(wrapper.find(Helmet).prop('titleTemplate')).toEqual(
      '%s - Tab for a Cause'
    )
    expect(wrapper.find(Helmet).prop('defaultTitle')).toEqual('Tab for a Cause')
  })
})

describe('App.js: consent management logic', () => {
  beforeEach(() => {
    requestEUAdPersonalization.mockReturnValue(true)
  })

  it('renders the QuantcastChoiceCMP when the CMP feature is enabled', async () => {
    requestEUAdPersonalization.mockReturnValue(true)
    const App = require('js/components/App/App').default
    const mockProps = getMockProps()
    const wrapper = shallow(<App {...mockProps} />)
    expect(wrapper.find(QuantcastChoiceCMP).exists()).toBe(true)
  })

  it('does not render the QuantcastChoiceCMP when the CMP feature is disabled', async () => {
    requestEUAdPersonalization.mockReturnValue(false)
    const App = require('js/components/App/App').default
    const mockProps = getMockProps()
    const wrapper = shallow(<App {...mockProps} />)
    expect(wrapper.find(QuantcastChoiceCMP).exists()).toBe(false)
  })

  it('wraps our CMP in an error boundary that ignores caught errors', async () => {
    const App = require('js/components/App/App').default
    const mockProps = getMockProps()
    const wrapper = shallow(<App {...mockProps} />)
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
    const mockProps = getMockProps()
    const wrapper = shallow(<App {...mockProps} />)
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
    const mockProps = getMockProps()
    const wrapper = shallow(<App {...mockProps} />)
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
    const mockProps = getMockProps()
    const wrapper = shallow(<App {...mockProps} />)
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
    const mockProps = getMockProps()
    const wrapper = shallow(<App {...mockProps} />)
    await wrapper.instance().componentDidMount()
    wrapper.update()

    const unregisterConsentCallback = require('js/ads/consentManagement')
      .unregisterConsentCallback
    expect(unregisterConsentCallback).not.toHaveBeenCalled()
    wrapper.unmount()
    expect(unregisterConsentCallback).toHaveBeenCalled()
  })
})

// Add Suspense/fallback tests after Enzyme fixes a bug with React.lazy
// and React.Suspense:
// https://github.com/airbnb/enzyme/issues/2200
