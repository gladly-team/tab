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

describe('getBingThumbnailURLToFillDimensions', () => {
  it('returns an unmodified URL when desiredDimensions is not defined', () => {
    const mockURL = 'https://www.bing.com/th?id=abcdefg&pid=News'
    const desiredDimensions = undefined
    const {
      getBingThumbnailURLToFillDimensions,
    } = require('js/utils/search-utils')
    expect(
      getBingThumbnailURLToFillDimensions(mockURL, desiredDimensions)
    ).toEqual(mockURL)
  })

  it('returns an unmodified URL when desiredDimensions is missing a dimension', () => {
    const mockURL = 'https://www.bing.com/th?id=abcdefg&pid=News'
    const desiredDimensions = { width: 350 } // malformed
    const {
      getBingThumbnailURLToFillDimensions,
    } = require('js/utils/search-utils')
    expect(
      getBingThumbnailURLToFillDimensions(mockURL, desiredDimensions)
    ).toEqual(mockURL)
  })

  it('returns the expected URL when the desired space is 3x the image and a different ratio', () => {
    const mockURL = 'https://www.bing.com/th?id=abcdefg&pid=News'
    const desiredDimensions = { width: 300, height: 500 }
    const {
      getBingThumbnailURLToFillDimensions,
    } = require('js/utils/search-utils')
    expect(
      getBingThumbnailURLToFillDimensions(mockURL, desiredDimensions)
    ).toEqual('https://www.bing.com/th?id=abcdefg&pid=News&w=300&h=500&c=7')
  })

  it('returns the expected URL when the desired space is half the image and the same ratio', () => {
    const mockURL = 'https://www.bing.com/th?id=abcdefg&pid=News'
    const desiredDimensions = { width: 200, height: 400 }
    const {
      getBingThumbnailURLToFillDimensions,
    } = require('js/utils/search-utils')
    expect(
      getBingThumbnailURLToFillDimensions(mockURL, desiredDimensions)
    ).toEqual('https://www.bing.com/th?id=abcdefg&pid=News&w=200&h=400&c=7')
  })

  it("returns the expected URL when the desired space is double the image's width but the same height", () => {
    const mockURL = 'https://www.bing.com/th?id=abcdefg&pid=News'
    const desiredDimensions = { width: 200, height: 400 }
    const {
      getBingThumbnailURLToFillDimensions,
    } = require('js/utils/search-utils')
    expect(
      getBingThumbnailURLToFillDimensions(mockURL, desiredDimensions)
    ).toEqual('https://www.bing.com/th?id=abcdefg&pid=News&w=200&h=400&c=7')
  })
})
