// Tests that require resetting the App.js module.
// Breaking out these tests to not require rewriting existing tests
// that don't use any modules state.
/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { flushAllPromises } from 'js/utils/test-utils'

jest.mock('tab-cmp')
jest.mock('js/components/Dashboard/DashboardView')
jest.mock('js/analytics/withPageviewTracking', () => child => child)
jest.mock('js/assets/logos/favicon.ico', () => '/tab-favicon.png')

const getMockProps = () => ({
  location: {
    pathname: '/newtab/',
    search: '',
  },
})

beforeAll(() => {
  jest.useFakeTimers()
})

beforeEach(() => {
  jest.clearAllMocks()
  process.env.REACT_APP_CMP_ENABLED = 'true'
})

afterEach(() => {
  jest.resetModules()
})

describe('App.js: tab-cmp', () => {
  it('calls tabCMP.initializeCMP after a 1000ms timeout', async () => {
    expect.assertions(3)
    const tabCMP = require('tab-cmp').default
    const App = require('js/components/App/App').default
    const mockProps = getMockProps()
    shallow(<App {...mockProps} />)
    await flushAllPromises()
    expect(tabCMP.initializeCMP).not.toHaveBeenCalled()
    jest.advanceTimersByTime(800)
    await flushAllPromises()
    expect(tabCMP.initializeCMP).not.toHaveBeenCalled()
    jest.advanceTimersByTime(300)
    await flushAllPromises()
    expect(tabCMP.initializeCMP).toHaveBeenCalled()
  })

  it('calls tabCMP.initializeCMP with the expected configuration', async () => {
    expect.assertions(1)
    const tabCMP = require('tab-cmp').default
    const App = require('js/components/App/App').default
    const mockProps = getMockProps()
    shallow(<App {...mockProps} />)
    await flushAllPromises()
    jest.runAllTimers()
    expect(tabCMP.initializeCMP).toHaveBeenCalledWith({
      debug: expect.any(Boolean),
      displayPersistentConsentLink: false,
      onError: expect.any(Function),
      primaryButtonColor: '#9d4ba3',
      publisherName: 'Tab for a Cause',
      publisherLogo: expect.any(String),
    })
  })

  it('does not call tabCMP.initializeCMP when process.env.REACT_APP_CMP_ENABLED is not "true"', async () => {
    expect.assertions(1)
    process.env.REACT_APP_CMP_ENABLED = 'false'
    const tabCMP = require('tab-cmp').default
    const App = require('js/components/App/App').default
    const mockProps = getMockProps()
    shallow(<App {...mockProps} />)
    await flushAllPromises()
    jest.runAllTimers()
    expect(tabCMP.initializeCMP).not.toHaveBeenCalled()
  })
})
