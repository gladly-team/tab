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

describe('clipTextToNearestWord', () => {
  it('returns the unmodified text if it is shorter than the max characters', () => {
    const text = 'Hi there! I am text.'
    const maxCharacters = 120
    const { clipTextToNearestWord } = require('js/utils/search-utils')
    expect(clipTextToNearestWord(text, maxCharacters)).toEqual(text)
  })

  it('returns clipped text and ellipses if it exceeds the max character count', () => {
    const text = 'abcdefghijklmnop'
    const maxCharacters = 12
    const { clipTextToNearestWord } = require('js/utils/search-utils')
    expect(clipTextToNearestWord(text, maxCharacters)).toEqual(
      'abcdefghijkl ...'
    )
  })

  it('clips text to the nearest whitespace if not too far back in the text', () => {
    const text = 'abcde fgh ijklm nop qrstu v wxy'
    const maxCharacters = 18
    const { clipTextToNearestWord } = require('js/utils/search-utils')
    expect(clipTextToNearestWord(text, maxCharacters)).toEqual(
      'abcde fgh ijklm ...'
    )
  })

  it('clips text in the middle of a word if the previous whitespace is too far back in the text', () => {
    const text = 'abcde fghijklmnopqrstuv wxyz'
    const maxCharacters = 20
    const { clipTextToNearestWord } = require('js/utils/search-utils')
    expect(clipTextToNearestWord(text, maxCharacters)).toEqual(
      'abcde fghijklmnopqrs ...'
    )
  })

  it('does not return only ellipses if the max character length is very short', () => {
    const text = 'abcdefghijklmnop'
    const maxCharacters = 6
    const { clipTextToNearestWord } = require('js/utils/search-utils')
    expect(clipTextToNearestWord(text, maxCharacters)).toEqual('abcdef ...')
  })

  it('does not return only ellipses if the max character length is very, very short', () => {
    const text = 'abcdefghijklmnop'
    const maxCharacters = 2
    const { clipTextToNearestWord } = require('js/utils/search-utils')
    expect(clipTextToNearestWord(text, maxCharacters)).toEqual('ab ...')
  })

  it('returns only the first character if there is whitespace after it and the maxCharacters limit is small', () => {
    const text = 'a bcdefghijklmnop'
    const maxCharacters = 8
    const { clipTextToNearestWord } = require('js/utils/search-utils')
    expect(clipTextToNearestWord(text, maxCharacters)).toEqual('a ...')
  })
})
