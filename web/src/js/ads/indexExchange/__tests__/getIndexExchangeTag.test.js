/* eslint-env jest */

import getIndexExchangeTag from 'js/ads/indexExchange/getIndexExchangeTag'

afterEach(() => {
  delete window.headertag
})

describe('getIndexExchangeTag', function() {
  it('returns the window.headertag object if one exists', () => {
    const fakeExistingTag = {
      something: {},
    }
    window.headertag = fakeExistingTag
    const ixTag = getIndexExchangeTag()
    expect(ixTag).toBe(fakeExistingTag)
  })

  it('returns a placeholder object with cmd if window.headertag is not set', () => {
    const ixTag = getIndexExchangeTag()
    expect(ixTag).toEqual({
      cmd: [],
    })
  })

  it("sets window.headertag if it isn't already set", () => {
    expect(window.headertag).toBeUndefined()
    getIndexExchangeTag()
    expect(window.headertag).not.toBeUndefined()
    expect(window.headertag.cmd).toEqual([])
  })
})
