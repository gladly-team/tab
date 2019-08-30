/* eslint-env jest */

import { getDefaultSearchGlobal } from 'js/utils/test-utils'
import { detectSupportedBrowser } from 'js/utils/detectBrowser'
import { getUrlParameters } from 'js/utils/utils'

jest.mock('js/utils/detectBrowser')
jest.mock('js/utils/utils')

beforeAll(() => {
  process.env.REACT_APP_SEARCH_EXT_ID_CHROME = 'abc-fake-extension-id'
})

beforeEach(() => {
  window.searchforacause = getDefaultSearchGlobal()
  getUrlParameters.mockReturnValue({
    q: 'coffee',
  })
  detectSupportedBrowser.mockReturnValue('chrome')
})

afterEach(() => {
  delete process.env.REACT_APP_SEARCH_PROVIDER
})

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

describe('getSearchProvider', () => {
  it('returns "bing" when the search provider env var is set to "bing"', () => {
    process.env.REACT_APP_SEARCH_PROVIDER = 'bing'
    const { getSearchProvider } = require('js/utils/search-utils')
    expect(getSearchProvider()).toEqual('bing')
  })

  it('returns "yahoo" when the search provider env var is set to "yahoo"', () => {
    process.env.REACT_APP_SEARCH_PROVIDER = 'yahoo'
    const { getSearchProvider } = require('js/utils/search-utils')
    expect(getSearchProvider()).toEqual('yahoo')
  })

  it('returns "yahoo" when the search provider env var is NOT set', () => {
    delete process.env.REACT_APP_SEARCH_PROVIDER
    const { getSearchProvider } = require('js/utils/search-utils')
    expect(getSearchProvider()).toEqual('yahoo')
  })

  it('returns "yahoo" when the search provider env var is set to an invalid value', () => {
    process.env.REACT_APP_SEARCH_PROVIDER = 'boop'
    const { getSearchProvider } = require('js/utils/search-utils')
    expect(getSearchProvider()).toEqual('yahoo')
  })
})

describe('getBingThumbnailURLToFillDimensions', () => {
  var windowURLClass

  beforeAll(() => {
    windowURLClass = window.URL
  })

  afterEach(() => {
    window.URL = windowURLClass
  })

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

  it('returns an the expected URL even when url.searchParams is not defined', () => {
    const mockURL = 'https://www.bing.com/th?id=abcdefg&pid=News'
    const desiredDimensions = { width: 300, height: 500 }
    jest.spyOn(window, 'URL').mockImplementation(() => undefined)
    const {
      getBingThumbnailURLToFillDimensions,
    } = require('js/utils/search-utils')
    expect(
      getBingThumbnailURLToFillDimensions(mockURL, desiredDimensions)
    ).toEqual('https://www.bing.com/th?id=abcdefg&pid=News&w=300&h=500&c=7')
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

  it('does not throw if passed null text', () => {
    const text = null
    const maxCharacters = 120
    const { clipTextToNearestWord } = require('js/utils/search-utils')
    expect(clipTextToNearestWord(text, maxCharacters)).toEqual(null)
  })
})

describe('showBingPagination', () => {
  it('returns false', () => {
    const { showBingPagination } = require('js/utils/search-utils')
    expect(showBingPagination()).toBe(true)
  })
})

describe('getSearchResultCountPerPage', () => {
  it('returns 10', () => {
    const { getSearchResultCountPerPage } = require('js/utils/search-utils')
    expect(getSearchResultCountPerPage()).toBe(10)
  })
})

describe('isSearchExtensionInstalled', () => {
  const setExtensionResponse = shouldRespond => {
    if (shouldRespond) {
      // Mock that the extension responds with data.
      jest
        .spyOn(window.chrome.runtime, 'sendMessage')
        .mockImplementation((extId, msg, callback) => {
          window.chrome.runtime.lastError = undefined
          callback({ installed: true })
        })
    } else {
      // Mock that there is no response from messaging the extension.
      jest
        .spyOn(window.chrome.runtime, 'sendMessage')
        .mockImplementation((extId, msg, callback) => {
          window.chrome.runtime.lastError =
            'Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.'
          callback(undefined)
        })
    }
  }

  beforeEach(() => {
    window.searchforacause.extension.isInstalled = false

    // Mock that there is no response from messaging the extension.
    setExtensionResponse(false)
  })

  it('[no-ext-msg] returns false if window.searchforacause is not defined and the "q" URL param has a value', async () => {
    expect.assertions(1)
    delete window.searchforacause
    getUrlParameters.mockReturnValue({
      q: 'coffee',
    })
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    return expect(isSearchExtensionInstalled()).resolves.toBe(false)
  })

  it('[no-ext-msg] returns false if window.searchforacause.extension.isInstalled is false', async () => {
    expect.assertions(1)
    window.searchforacause.extension.isInstalled = false
    getUrlParameters.mockReturnValue({
      q: 'coffee',
    })
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    return expect(isSearchExtensionInstalled()).resolves.toBe(false)
  })

  it('[no-ext-msg] returns true if window.searchforacause.extension.isInstalled is true', async () => {
    expect.assertions(1)
    window.searchforacause.extension.isInstalled = true
    getUrlParameters.mockReturnValue({
      q: 'coffee',
    })
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    return expect(isSearchExtensionInstalled()).resolves.toBe(true)
  })

  it('[no-ext-msg] returns false if the search "src" URL param is null and a "q" URL param has a value', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({
      q: 'coffee',
      src: null,
    })
    detectSupportedBrowser.mockReturnValue('chrome')
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    return expect(isSearchExtensionInstalled()).resolves.toBe(false)
  })

  it('[no-ext-msg] returns true when the "q" URL param does not have value, even if the "src" URL param is not defined', async () => {
    expect.assertions(1)
    window.searchforacause.extension.isInstalled = false
    getUrlParameters.mockReturnValue({
      q: null,
      src: null,
    })
    detectSupportedBrowser.mockReturnValue('chrome')
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    return expect(isSearchExtensionInstalled()).resolves.toBe(true)
  })

  it('[no-ext-msg] returns true if the search "src" URL param is Chrome and the browser is Chrome, even when window.searchforacause.extension.isInstalled is false', async () => {
    expect.assertions(1)
    window.searchforacause.extension.isInstalled = false
    getUrlParameters.mockReturnValue({
      q: 'coffee',
      src: 'chrome',
    })
    detectSupportedBrowser.mockReturnValue('chrome')
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    return expect(isSearchExtensionInstalled()).resolves.toBe(true)
  })

  it('[no-ext-msg] returns true if the search "src" URL param is Firefox and the browser is Firefox, even when window.searchforacause.extension.isInstalled is false', async () => {
    expect.assertions(1)
    window.searchforacause.extension.isInstalled = false
    getUrlParameters.mockReturnValue({
      q: 'coffee',
      src: 'ff',
    })
    detectSupportedBrowser.mockReturnValue('firefox')
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    return expect(isSearchExtensionInstalled()).resolves.toBe(true)
  })

  it('[no-ext-msg] returns false if the search "src" URL param is Firefox but the browser is Chrome', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({
      q: 'coffee',
      src: 'ff',
    })
    detectSupportedBrowser.mockReturnValue('chrome')
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    return expect(isSearchExtensionInstalled()).resolves.toBe(false)
  })

  it('[no-ext-msg] returns false if the search "src" URL param is "self" but the browser is Chrome', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({
      q: 'coffee',
      src: 'self',
    })
    detectSupportedBrowser.mockReturnValue('chrome')
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    return expect(isSearchExtensionInstalled()).resolves.toBe(false)
  })

  it('[no-ext-msg] sets window.searchforacause.extension.isInstalled to true when the search source browser extension matches the browser', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({
      q: 'coffee',
      src: 'ff',
    })
    detectSupportedBrowser.mockReturnValue('firefox')
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    await isSearchExtensionInstalled()
    expect(window.searchforacause.extension.isInstalled).toBe(true)
  })

  it('[no-ext-msg] sets window.searchforacause.extension.isInstalled to true when the "q" URL parameter is null', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({
      q: null,
      src: null,
    })
    detectSupportedBrowser.mockReturnValue('firefox')
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    await isSearchExtensionInstalled()
    expect(window.searchforacause.extension.isInstalled).toBe(true)
  })

  it('[ext-msg] calls chrome.runtime.sendMessage with the expected extension ID and message', async () => {
    expect.assertions(1)
    setExtensionResponse(true)
    getUrlParameters.mockReturnValue({
      q: null,
      src: null,
    })
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    await isSearchExtensionInstalled()
    expect(window.chrome.runtime.sendMessage).toHaveBeenCalledWith(
      'abc-fake-extension-id',
      { message: 'ping' },
      expect.any(Function)
    )
  })

  it('[ext-msg] returns true if the extension responds and the "q" and "src" URL params do not have values', async () => {
    expect.assertions(1)
    setExtensionResponse(true)
    getUrlParameters.mockReturnValue({
      q: null,
      src: null,
    })
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    await isSearchExtensionInstalled()
    expect(window.searchforacause.extension.isInstalled).toBe(true)
  })

  it('[ext-msg] sets window.searchforacause.extension.isInstalled to true when the extension responds', async () => {
    expect.assertions(1)
    setExtensionResponse(true)
    getUrlParameters.mockReturnValue({
      q: null,
      src: null,
    })
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    await isSearchExtensionInstalled()
    expect(window.searchforacause.extension.isInstalled).toBe(true)
  })

  it('[ext-msg] returns true if the extension responds, even when the search "src" URL param is Firefox but the browser is Chrome', async () => {
    expect.assertions(1)
    setExtensionResponse(true)
    getUrlParameters.mockReturnValue({
      q: 'pizza',
      src: 'chrome',
    })
    detectSupportedBrowser.mockReturnValue('firefox')
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    await isSearchExtensionInstalled()
    expect(window.searchforacause.extension.isInstalled).toBe(true)
  })

  it('[ext-msg] returns true if the extension responds, even when the search "src" URL param is not set', async () => {
    expect.assertions(1)
    setExtensionResponse(true)
    getUrlParameters.mockReturnValue({
      q: 'pizza',
      src: null,
    })
    detectSupportedBrowser.mockReturnValue('firefox')
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    await isSearchExtensionInstalled()
    expect(window.searchforacause.extension.isInstalled).toBe(true)
  })

  it('[ext-msg] returns false if messaging the extension throws an error when the "src" URL param is has no value and the "q" URL param has a value', async () => {
    expect.assertions(1)

    // Mock that the chrome.runtime.sendMessage throws.
    jest.spyOn(window.chrome.runtime, 'sendMessage').mockImplementation(() => {
      throw new Error('This is not a Chrome browser, yo.')
    })

    getUrlParameters.mockReturnValue({
      q: 'pizza',
      src: null,
    })
    detectSupportedBrowser.mockReturnValue('firefox')
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    await isSearchExtensionInstalled()
    expect(window.searchforacause.extension.isInstalled).toBe(false)
  })

  it('[ext-msg] returns true if messaging the extension throws an error, but when the "src" URL param is matches the browser and the "q" URL param has a value', async () => {
    expect.assertions(1)

    // Mock that the chrome.runtime.sendMessage throws.
    jest.spyOn(window.chrome.runtime, 'sendMessage').mockImplementation(() => {
      throw new Error('This is not a Chrome browser, yo.')
    })

    getUrlParameters.mockReturnValue({
      q: 'pizza',
      src: 'chrome',
    })
    detectSupportedBrowser.mockReturnValue('chrome')
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    await isSearchExtensionInstalled()
    expect(window.searchforacause.extension.isInstalled).toBe(true)
  })

  it('[ext-msg] returns true if messaging the extension takes too long, but when the "src" URL param is matches the browser and the "q" URL param has a value', async () => {
    expect.assertions(1)

    // Mock that the chrome.runtime.sendMessage takes a long time to respond
    jest.spyOn(window.chrome.runtime, 'sendMessage').mockImplementation(() => {
      // Don't respond at all.
    })

    getUrlParameters.mockReturnValue({
      q: 'pizza',
      src: 'chrome',
    })
    detectSupportedBrowser.mockReturnValue('chrome')
    const { isSearchExtensionInstalled } = require('js/utils/search-utils')
    await isSearchExtensionInstalled()
    expect(window.searchforacause.extension.isInstalled).toBe(true)
  })
})

describe('getSearchGlobal', () => {
  beforeEach(() => {
    // Because we set this in the global beforeEach above.
    delete window.searchforacause
  })

  afterEach(() => {
    delete window.searchforacause
  })

  it('returns an object with the expected keys', () => {
    const { getSearchGlobal } = require('js/utils/search-utils')
    expect(Object.keys(getSearchGlobal()).sort()).toEqual([
      'extension',
      'queryRequest',
      'search',
    ])
  })

  it('returns a queryRequest object with the expected keys', () => {
    const { getSearchGlobal } = require('js/utils/search-utils')
    expect(Object.keys(getSearchGlobal().queryRequest).sort()).toEqual([
      'displayedResults',
      'responseData',
      'status',
    ])
  })

  it('sets window.searchforacause', () => {
    delete window.searchforacause
    expect(window.searchforacause).toBeUndefined()
    const { getSearchGlobal } = require('js/utils/search-utils')
    getSearchGlobal()
    expect(window.searchforacause).not.toBeUndefined()
  })

  it('uses existing window.searchforacause object if one exists', () => {
    const existingSearchGlobal = {
      foo: 'bar',
    }
    window.searchforacause = existingSearchGlobal
    const { getSearchGlobal } = require('js/utils/search-utils')
    const tabGlobal = getSearchGlobal()
    expect(tabGlobal).toBe(existingSearchGlobal)
  })
})
