/* eslint-env jest */

import googleDisplayAd from '../googleDisplayAd'

beforeEach(() => {
  delete window.googletag
})

afterAll(() => {
  delete window.googletag
})

describe('googleDisplayAd', function () {
  it('runs without error', () => {
    googleDisplayAd('my-ad')
  })

  it('pushes commands to googletag.cmd', () => {
    expect(window.googletag).toBeUndefined()
    googleDisplayAd('some-ad')
    expect(window.googletag.cmd.length).toBe(1)
    googleDisplayAd('another-ad')
    expect(window.googletag.cmd.length).toBe(2)
  })
})
