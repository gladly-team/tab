/* eslint-env jest */

import prebidConfig from '../prebidConfig'
import { getGoogleTag } from '../../google/googleTag'
import { getPrebidPbjs } from '../getPrebidPbjs'

beforeEach(() => {
  delete window.googletag
  delete window.pbjs
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
})
