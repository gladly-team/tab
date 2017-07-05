/* eslint-env jest */

import googleDisplayAd from '../googleDisplayAd'

beforeEach(() => {
  delete window.googletag
})

describe('googleDisplayAd', function () {
  it('runs without error', () => {
    googleDisplayAd()
  })

  it('pushes a command to googletag.cmd', () => {
    expect(window.googletag).toBeUndefined()
    googleDisplayAd()
    expect(window.googletag.cmd.length).toBe(1)
  })
})
