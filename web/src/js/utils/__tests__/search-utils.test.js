/* eslint-env jest */

describe('isReactSnapClient', () => {
  it('returns true when the userAgent is "ReactSnap"', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'ReactSnap',
      writable: true,
    })
    const { isReactSnapClient } = require('js/utils/search-utils')
    expect(isReactSnapClient()).toBe(true)
  })

  it('returns false when the userAgent is something other than "ReactSnap"', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.96 Safari/537.36',
      writable: true,
    })
    const { isReactSnapClient } = require('js/utils/search-utils')
    expect(isReactSnapClient()).toBe(false)
  })
})
