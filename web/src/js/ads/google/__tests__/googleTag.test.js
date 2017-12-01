/* eslint-env jest */

import { setUpGoogleTag } from '../googleTag'

afterEach(() => {
  delete window.googletag
})

describe('googleTag', function () {
  it('sets window.googletag', () => {
    delete window.googletag
    expect(window.googletag).toBeUndefined()
    setUpGoogleTag()
    expect(window.googletag).not.toBeUndefined()
  })

  it('uses existing window.googletag object if one exists', () => {
    // Set a fake existing googletag
    const fakeCmd = function () {}
    const fakeExistingGoogleTag = {
      cmd: [fakeCmd],
      foo: 'bar'
    }
    window.googletag = fakeExistingGoogleTag

    expect(window.googletag).toBe(fakeExistingGoogleTag)
    const gTag = setUpGoogleTag()
    expect(window.googletag).toBe(fakeExistingGoogleTag)
    expect(gTag).toBe(fakeExistingGoogleTag)
  })
})
