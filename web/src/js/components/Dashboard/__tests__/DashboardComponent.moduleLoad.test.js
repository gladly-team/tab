// Tests that require resetting the module.
// Breaking out these tests to not require rewriting existing tests
// that don't use any modules state.
/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

jest.mock('uuid/v4', () =>
  jest.fn(() => '101b73c7-468c-4d29-b224-0c07f621bc52')
)
jest.mock('js/analytics/logEvent')
jest.mock('js/utils/localstorage-mgr')
jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')
jest.mock('js/ads/adHelpers')
jest.mock('js/utils/local-user-data-mgr')
jest.mock('js/utils/feature-flags')
jest.mock('js/utils/experiments')
jest.mock('js/utils/detectBrowser')
jest.mock('js/mutations/LogUserExperimentActionsMutation')
jest.mock('js/mutations/LogUserRevenueMutation')
jest.mock('js/navigation/utils')
jest.mock('js/utils/logger')
jest.mock('js/utils/v4-beta-opt-in')

const getMockProps = () => ({
  user: {
    id: 'abc-123',
    joined: '2017-04-10T14:00:00.000',
    searches: 0,
    tabs: 12,
    experimentActions: {},
  },
  app: {
    campaign: {
      isLive: false,
    },
  },
})

beforeAll(() => {
  jest.useFakeTimers()
})

beforeEach(() => {
  jest.clearAllMocks()
  const { setGAMDevKeyValue } = require('js/utils/feature-flags')
  setGAMDevKeyValue.mockReturnValue(false)
})

afterEach(() => {
  jest.resetModules()
})

describe('Dashboard component: fetchAds', () => {
  it('does not set a "dev" GAM key during fetchAds (on prod)', () => {
    const { fetchAds } = require('tab-ads')
    const { setGAMDevKeyValue } = require('js/utils/feature-flags')
    setGAMDevKeyValue.mockReturnValue(false)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    shallow(<DashboardComponent {...getMockProps()} />)
    const config = fetchAds.mock.calls[0][0]
    expect(config.pageLevelKeyValues.dev).toBeUndefined()
  })

  it('sets the "dev=true" GAM key during fetchAds (on dev)', () => {
    const { fetchAds } = require('tab-ads')
    const { setGAMDevKeyValue } = require('js/utils/feature-flags')
    setGAMDevKeyValue.mockReturnValue(true)
    const DashboardComponent = require('js/components/Dashboard/DashboardComponent')
      .default
    shallow(<DashboardComponent {...getMockProps()} />)
    const config = fetchAds.mock.calls[0][0]
    expect(config.pageLevelKeyValues.dev).toEqual('true') // should be a string
  })
})
