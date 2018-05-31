/* eslint-env jest */

import getPrebidPbjs from '../getPrebidPbjs'

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
    expect(window.pbjs).toBe(fakeExistingPbjs)
    expect(pbVar).toBe(fakeExistingPbjs)
  })
})
