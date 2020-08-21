/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import V0MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Helmet } from 'react-helmet'
import ErrorBoundary from 'js/components/General/ErrorBoundary'

jest.mock('js/components/Dashboard/DashboardView')
jest.mock('js/analytics/withPageviewTracking', () => child => child)
jest.mock('js/assets/logos/favicon.ico', () => '/tab-favicon.png')

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

// Add Suspense/fallback tests after Enzyme fixes a bug with React.lazy
// and React.Suspense:
// https://github.com/airbnb/enzyme/issues/2200
