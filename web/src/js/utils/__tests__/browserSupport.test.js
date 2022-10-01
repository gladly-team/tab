/* eslint-env jest */

import {
  isSearchExtensionSupported,
  isSearchActivityComponentSupported,
  isTabExtensionSupported,
  simplifyBrowserName,
} from '../browserSupport'
import {
  CHROME_BROWSER,
  EDGE_BROWSER,
  FIREFOX_BROWSER,
  OPERA_BROWSER,
  SAFARI_BROWSER,
  UNSUPPORTED_BROWSER,
} from '../../constants'

jest.mock('detect-browser')

afterEach(() => {
  jest.clearAllMocks()
})

describe('simplifyBrowserName', () => {
  it('returns "chrome" on Chrome', () => {
    const origBrowserName = CHROME_BROWSER
    expect(simplifyBrowserName(origBrowserName)).toEqual(CHROME_BROWSER)
  })

  it('returns "chrome" on Chrome iOS', () => {
    const origBrowserName = 'crios'
    expect(simplifyBrowserName(origBrowserName)).toEqual(CHROME_BROWSER)
  })

  it('returns "firefox" on Firefox', () => {
    const origBrowserName = 'firefox'
    expect(simplifyBrowserName(origBrowserName)).toEqual(FIREFOX_BROWSER)
  })

  it('returns "edge" on Edge', () => {
    const origBrowserName = 'edge'
    expect(simplifyBrowserName(origBrowserName)).toEqual(EDGE_BROWSER)
  })

  it('returns "edge" on Edge Chromium', () => {
    const origBrowserName = 'edge-chromium'
    expect(simplifyBrowserName(origBrowserName)).toEqual(EDGE_BROWSER)
  })

  it('returns "edge" on Edge iOS', () => {
    const origBrowserName = 'edge-ios'
    expect(simplifyBrowserName(origBrowserName)).toEqual(EDGE_BROWSER)
  })

  it('returns "safari" on Safari', () => {
    const origBrowserName = 'safari'
    expect(simplifyBrowserName(origBrowserName)).toEqual(SAFARI_BROWSER)
  })

  it('returns "opera" on Opera', () => {
    const origBrowserName = 'opera'
    expect(simplifyBrowserName(origBrowserName)).toEqual(OPERA_BROWSER)
  })

  it('returns "other" for browsers we don\'t care about', () => {
    expect(simplifyBrowserName('aol')).toEqual(UNSUPPORTED_BROWSER)
    expect(simplifyBrowserName('bb10')).toEqual(UNSUPPORTED_BROWSER)
    expect(simplifyBrowserName('facebook')).toEqual(UNSUPPORTED_BROWSER)
    expect(simplifyBrowserName('phantomjs')).toEqual(UNSUPPORTED_BROWSER)
    expect(simplifyBrowserName('yandexbrowser')).toEqual(UNSUPPORTED_BROWSER)
  })
})

describe('isSearchExtensionSupported', () => {
  it('returns true on Chrome', () => {
    expect(isSearchExtensionSupported(CHROME_BROWSER)).toEqual(true)
  })

  it('returns false on Edge', () => {
    expect(isSearchExtensionSupported(EDGE_BROWSER)).toEqual(false)
  })

  it('returns true on Firefox', () => {
    expect(isSearchExtensionSupported(FIREFOX_BROWSER)).toEqual(true)
  })

  it('returns false on Opera', () => {
    expect(isSearchExtensionSupported(OPERA_BROWSER)).toEqual(false)
  })

  it('returns false on Safari', () => {
    expect(isSearchExtensionSupported(SAFARI_BROWSER)).toEqual(false)
  })

  it('returns false on any other browser', () => {
    expect(isSearchExtensionSupported(UNSUPPORTED_BROWSER)).toEqual(false)
  })
})