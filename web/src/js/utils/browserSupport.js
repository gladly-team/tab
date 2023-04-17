import {
  CHROME_BROWSER,
  EDGE_BROWSER,
  FIREFOX_BROWSER,
  OPERA_BROWSER,
  SAFARI_BROWSER,
  UNSUPPORTED_BROWSER,
} from '../constants'

/**
 * Map possible browser names from the "detect-browser" library to a subset
 * of browser names we care about.
 * @param {String} browserName - The browser name determined by the
 *   "detect-browser" library. As of v5.3.0, these options include
 *   (see source here:
 *     https://github.com/DamonOehlman/detect-browser/blob/master/src/index.ts
 *   ):
 *   'aol'
 *   'android'
 *   'bb10'
 *   'beaker'
 *   'chrome'
 *   'chromium-webview'
 *   'crios'
 *   'curl'
 *   'edge'
 *   'edge-chromium'
 *   'edge-ios'
 *   'facebook'
 *   'firefox'
 *   'fxios'
 *   'ie'
 *   'instagram'
 *   'ios'
 *   'ios-webview'
 *   'kakaotalk'
 *   'miui'
 *   'netfront'
 *   'opera'
 *   'opera-mini'
 *   'phantomjs'
 *   'pie'
 *   'safari'
 *   'samsung'
 *   'searchbot'
 *   'silk'
 *   'yandexbrowser'
 * @return {String} One of: "chrome", "edge", "firefox", "opera", "safari",
 *   or "other".
 */
export const simplifyBrowserName = browserName => {
  switch (browserName) {
    case 'chrome':
    case 'chromium-webview':
    case 'crios':
      return CHROME_BROWSER
    case 'edge':
    case 'edge-ios':
    case 'edge-chromium':
    case 'ie':
      return EDGE_BROWSER
    case 'firefox':
    case 'fxios':
      return FIREFOX_BROWSER
    case 'opera':
    case 'opera-mini':
      return OPERA_BROWSER
    case 'ios':
    case 'ios-webview':
    case 'safari':
      return SAFARI_BROWSER
    default:
      return UNSUPPORTED_BROWSER
  }
}

/**
 * Given a browser name, return whether we have a Search for a Cause
 * extension for that browser.
 * @param {String} browserNameSimplified - The browser name. It should be one
 *   of the return values from `simplifyBrowserName`.
 * @return {Boolean} Whether the browser supports a search extension
 */
export const isSearchExtensionSupported = browserNameSimplified => {
  const sfacSupportedBrowsers = [CHROME_BROWSER, FIREFOX_BROWSER]
  return sfacSupportedBrowsers.indexOf(browserNameSimplified) > -1
}

/**
 * Given a browser name, return whether we have a Shop for a Cause
 * extension for that browser.
 * @param {String} browserNameSimplified - The browser name. It should be one
 *   of the return values from `simplifyBrowserName`.
 * @return {Boolean} Whether the browser supports a search extension
 */
export const isShopExtensionSupported = browserNameSimplified => {
  const supportedBrowsers = [CHROME_BROWSER, EDGE_BROWSER]
  return supportedBrowsers.indexOf(browserNameSimplified) > -1
}
