/* eslint-env jest */

import getGoogleTag from '../getGoogleTag'

afterEach(() => {
  delete window.googletag
})

describe('getGoogleTag', function () {
  it('sets window.googletag', () => {
    delete window.googletag
    expect(window.googletag).toBeUndefined()
    getGoogleTag()
    expect(window.googletag).not.toBeUndefined()
    expect(window.googletag.cmd).toEqual([])
  })

  it('uses existing window.googletag object if one exists', () => {
    // Set a fake existing googletag
    const fakeCmd = function () {}
    const fakeExistingGoogletag = {
      cmd: [fakeCmd]
    }
    window.googletag = fakeExistingGoogletag

    const gTag = getGoogleTag()
    expect(gTag).toBe(fakeExistingGoogletag)
  })
})
