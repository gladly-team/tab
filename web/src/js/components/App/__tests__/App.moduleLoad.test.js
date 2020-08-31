// Tests that require resetting the App.js module.
// Breaking out these tests to not require rewriting existing tests
// that don't use any modules state.
/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { flushAllPromises } from 'js/utils/test-utils'

jest.mock('js/components/Dashboard/DashboardView')
jest.mock('js/analytics/withPageviewTracking', () => child => child)
jest.mock('js/assets/logos/favicon.ico', () => '/tab-favicon.png')
jest.mock('js/utils/initializeCMP')

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
})

afterEach(() => {
  jest.resetModules()
})

describe('App.js: tab-cmp', () => {
  it('calls tabCMP.initializeCMP after a ~2000ms timeout', async () => {
    expect.assertions(3)
    const initializeCMP = require('js/utils/initializeCMP').default
    const App = require('js/components/App/App').default
    const mockProps = getMockProps()
    shallow(<App {...mockProps} />)
    await flushAllPromises()
    expect(initializeCMP).not.toHaveBeenCalled()
    jest.advanceTimersByTime(900)
    await flushAllPromises()
    expect(initializeCMP).not.toHaveBeenCalled()
    jest.advanceTimersByTime(1400)
    await flushAllPromises()
    expect(initializeCMP).toHaveBeenCalled()
  })
})
