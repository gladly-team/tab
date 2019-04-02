/* eslint-env jest */

import {
  CHROME_BROWSER,
  FIREFOX_BROWSER,
  UNSUPPORTED_BROWSER,
} from 'js/constants'

jest.mock('browser-detect')

const createMockBrowserInfo = (browser = 'chrome', mobile = false) => {
  return {
    name: browser,
    version: '58.0.3029',
    versionNumber: 58.03029,
    mobile: mobile,
    os: 'Windows NT 10.0',
  }
}
afterEach(() => {
  jest.clearAllMocks()
})

describe('detectBrowser', () => {
  it('returns "chrome" for desktop Chrome', () => {
    const browserDetectLib = require('browser-detect').default
    browserDetectLib.mockReturnValueOnce(createMockBrowserInfo('chrome', false))
    const { detectSupportedBrowser } = require('js/utils/detectBrowser')
    expect(detectSupportedBrowser()).toEqual(CHROME_BROWSER)
  })

  it('returns "chrome" for mobile Chrome', () => {
    const browserDetectLib = require('browser-detect').default
    browserDetectLib.mockReturnValueOnce(createMockBrowserInfo('chrome', true))
    const { detectSupportedBrowser } = require('js/utils/detectBrowser')
    expect(detectSupportedBrowser()).toEqual(CHROME_BROWSER)
  })

  it('returns "chrome" for desktop chromium', () => {
    const browserDetectLib = require('browser-detect').default
    browserDetectLib.mockReturnValueOnce(
      createMockBrowserInfo('chromium', false)
    )
    const { detectSupportedBrowser } = require('js/utils/detectBrowser')
    expect(detectSupportedBrowser()).toEqual(CHROME_BROWSER)
  })

  it('returns "chrome" for "crios" (Chrome on iOS)', () => {
    const browserDetectLib = require('browser-detect').default
    browserDetectLib.mockReturnValueOnce(createMockBrowserInfo('crios', true))
    const { detectSupportedBrowser } = require('js/utils/detectBrowser')
    expect(detectSupportedBrowser()).toEqual(CHROME_BROWSER)
  })

  it('returns "firefox" for desktop Firefox', () => {
    const browserDetectLib = require('browser-detect').default
    browserDetectLib.mockReturnValueOnce(
      createMockBrowserInfo('firefox', false)
    )
    const { detectSupportedBrowser } = require('js/utils/detectBrowser')
    expect(detectSupportedBrowser()).toEqual(FIREFOX_BROWSER)
  })

  it('returns "firefox" for mobile Firefox', () => {
    const browserDetectLib = require('browser-detect').default
    browserDetectLib.mockReturnValueOnce(createMockBrowserInfo('firefox', true))
    const { detectSupportedBrowser } = require('js/utils/detectBrowser')
    expect(detectSupportedBrowser()).toEqual(FIREFOX_BROWSER)
  })

  it('returns "other" for desktop Safari', () => {
    const browserDetectLib = require('browser-detect').default
    browserDetectLib.mockReturnValueOnce(createMockBrowserInfo('safari', false))
    const { detectSupportedBrowser } = require('js/utils/detectBrowser')
    expect(detectSupportedBrowser()).toEqual(UNSUPPORTED_BROWSER)
  })

  it('returns "other" for mobile Safari', () => {
    const browserDetectLib = require('browser-detect').default
    browserDetectLib.mockReturnValueOnce(createMockBrowserInfo('safari', true))
    const { detectSupportedBrowser } = require('js/utils/detectBrowser')
    expect(detectSupportedBrowser()).toEqual(UNSUPPORTED_BROWSER)
  })

  it('returns "other" for some unexpected browser name', () => {
    const browserDetectLib = require('browser-detect').default
    browserDetectLib.mockReturnValueOnce(
      createMockBrowserInfo('hypebrowzer2000', false)
    )
    const { detectSupportedBrowser } = require('js/utils/detectBrowser')
    expect(detectSupportedBrowser()).toEqual(UNSUPPORTED_BROWSER)
  })
})
