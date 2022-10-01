import useBrowserInfo from './useBrowserInfo'
import { simplifyBrowserName } from '../browserSupport'

/**
 * Return the user's browser name, simplified to a short list of browsers
 * we care about.
 * @param {String|undefined} userAgent - An optional user agent string to
 *   support determining the browser on the server side.
 * @return {String|undefined} The browser name. Undefined if it has not yet
 *   determined the browser (e.g., on first render without a user agent).
 */
const useBrowserName = ({ userAgent } = {}) => {
  let browserName
  const browserInfo = useBrowserInfo({ userAgent }) || {}
  if (browserInfo.name) {
    browserName = simplifyBrowserName(browserInfo.name)
  }
  return browserName
}

export default useBrowserName
