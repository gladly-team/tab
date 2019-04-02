import detectBrowser from 'browser-detect'
import {
  CHROME_BROWSER,
  FIREFOX_BROWSER,
  UNSUPPORTED_BROWSER,
} from 'js/constants'

/**
 * Determines the user's browser. If the browser is one
 * for which we have a browser extension, return the browser
 * name; else, return "other".
 * @return {String} One of "chrome", "firefox", or "other"
 */
export const detectSupportedBrowser = () => {
  const browserInfo = detectBrowser()
  let browser
  switch (browserInfo.name) {
    case 'chrome':
      browser = CHROME_BROWSER
      break
    case 'chromium':
      browser = CHROME_BROWSER
      break
    case 'crios':
      browser = CHROME_BROWSER
      break
    case 'firefox':
      browser = FIREFOX_BROWSER
      break
    default:
      browser = UNSUPPORTED_BROWSER
      break
  }
  return browser
}
