/* eslint-env jest */

import googleDisplayAd from 'js/ads/google/googleDisplayAd'

beforeEach(() => {
  delete window.googletag

  // Set up googletag
  window.googletag = {}
  window.googletag.cmd = []
})

afterAll(() => {
  delete window.googletag
})

describe('googleDisplayAd', function() {
  it('runs without error', () => {
    googleDisplayAd('my-ad')
  })

  it('pushes commands to googletag.cmd', () => {
    googleDisplayAd('some-ad')
    expect(window.googletag.cmd.length).toBe(1)
    googleDisplayAd('another-ad')
    expect(window.googletag.cmd.length).toBe(2)
  })
})
