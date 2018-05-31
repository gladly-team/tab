/* eslint-env jest */

import prebidConfig from '../prebidConfig'
import getGoogleTag from '../../google/getGoogleTag'
import getPrebidPbjs from '../getPrebidPbjs'
import { getDefaultTabGlobal } from 'utils/test-utils'

beforeEach(() => {
  window.tabforacause = getDefaultTabGlobal()

  // Barebones mock of Prebid pbjs
  window.pbjs = {
    que: [],
    setConfig: jest.fn(),
    bidderSettings: {},
    addAdUnits: jest.fn(),
    requestBids: jest.fn(),
    setTargetingForGPTAsync: jest.fn()
  }

  // Set up googletag
  delete window.googletag
  window.googletag = getGoogleTag()
})

afterAll(() => {
  delete window.googletag
  delete window.pbjs
})

describe('prebidConfig', function () {
  it('runs without error', () => {
    prebidConfig()
  })

  it('pushes commands to googletag.cmd', () => {
    const googletag = getGoogleTag()
    expect(googletag.cmd.length).toBe(0)
    prebidConfig()
    expect(googletag.cmd.length).toBeGreaterThan(0)
  })

  it('pushes commands to pbjs.que', () => {
    const pbjs = getPrebidPbjs()
    expect(pbjs.que.length).toBe(0)
    prebidConfig()
    expect(pbjs.que.length).toBeGreaterThan(0)
  })

  it('includes consentManagement setting when in EU', () => {
    const pbjs = getPrebidPbjs()
    prebidConfig(true)

    // Run queued pbjs commands
    pbjs.que.forEach((cmd) => cmd())

    expect(pbjs.setConfig.mock.calls[0][0]['consentManagement']).not.toBeUndefined()
  })

  it('does not include consentManagement setting when not in EU', () => {
    const pbjs = getPrebidPbjs()
    prebidConfig(false)

    // Run queued pbjs commands
    pbjs.que.forEach((cmd) => cmd())

    expect(pbjs.setConfig.mock.calls[0][0]['consentManagement']).toBeUndefined()
  })
})
