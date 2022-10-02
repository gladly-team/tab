import useBrowserInfo from 'js/utils/hooks/useBrowserInfo'
import {
  isSearchExtensionSupported,
  simplifyBrowserName,
} from 'js/utils/browserSupport'

/**
 * Return whether there is a Search for a Cause extension available for the
 * user's browser.
 * @param {String|undefined} userAgent - An optional user agent string to
 *   support determining the browser on the server side.
 * @return {Boolean} Whether the browser supports a search extension
 */
const useDoesBrowserSupportSearchExtension = ({ userAgent } = {}) => {
  const browserInfo = useBrowserInfo({ userAgent }) || {}
  const isSearchSupported = isSearchExtensionSupported(
    simplifyBrowserName(browserInfo.name)
  )
  return isSearchSupported
}

export default useDoesBrowserSupportSearchExtension
