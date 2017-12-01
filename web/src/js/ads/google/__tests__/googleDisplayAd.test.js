/* eslint-env jest */

import { setUpGoogleTag } from '../googleTag'
import googleDisplayAd from '../googleDisplayAd'

beforeEach(() => {
  delete window.googletag
  setUpGoogleTag()
})

afterAll(() => {
  delete window.googletag
})

describe('googleDisplayAd', function () {
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
