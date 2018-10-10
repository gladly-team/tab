/* eslint-env jest */

import getPrebidPbjs from 'js/ads/prebid/getPrebidPbjs'

afterEach(() => {
  delete window.pbjs
})

describe('getPrebidPbjs', function () {
  it('sets window.pbjs', () => {
    delete window.pbjs
    expect(window.pbjs).toBeUndefined()
    getPrebidPbjs()
    expect(window.pbjs).not.toBeUndefined()
  })

  it('uses existing window.pbjs object if one exists', () => {
    // Set a fake existing pbjs
    const fakeCmd = function () {}
    const fakeExistingPbjs = {
      que: [fakeCmd],
      foo: 'bar'
    }
    window.pbjs = fakeExistingPbjs

    expect(window.pbjs).toBe(fakeExistingPbjs)
    const pbVar = getPrebidPbjs()
    expect(pbVar).toBe(fakeExistingPbjs)
  })
})
