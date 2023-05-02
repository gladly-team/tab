import useBrowserInfo from 'js/utils/hooks/useBrowserInfo'
import {
  isShopExtensionSupported,
  simplifyBrowserName,
} from 'js/utils/browserSupport'

/**
 * Return whether there is a Shop for a Cause extension available for the
 * user's browser.
 * @param {String|undefined} userAgent - An optional user agent string to
 *   support determining the browser on the server side.
 * @return {Boolean} Whether the browser supports a shop extension
 */
const useDoesBrowserSupportShopExtension = ({ userAgent } = {}) => {
  const browserInfo = useBrowserInfo({ userAgent }) || {}
  const isSearchSupported = isShopExtensionSupported(
    simplifyBrowserName(browserInfo.name)
  )
  return isSearchSupported
}

export default useDoesBrowserSupportShopExtension
