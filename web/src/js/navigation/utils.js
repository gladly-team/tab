/**
 * Determine whether a URL is for a different app from the current
 * URL. In other words, navigating to the new URL cannot simply
 * navigate within a single-page app.
 * @param {String} newURL - The URL to test
 * @return {Boolean} Whether the new URL is for another app
 */
export const isURLForDifferentApp = newURL => {
  const newURLObj = new URL(newURL, window.location.origin)

  // If the URLs are on different domains, they're different apps.
  const isSameDomain = newURLObj.hostname === window.location.hostname
  if (!isSameDomain) {
    return true
  }

  // The first-level paths at which we host separate apps. Any other
  // paths are part of the "homepage" app.
  const differentAppSubpaths = ['newtab', 'search']

  // If the new URL or current URL are on one of our app subpaths, and
  // they aren't on the same subpath, they're on different apps.
  const newURLFirstSubpath = newURLObj.pathname.split('/')[1]
  const currentURLFirstSubpath = window.location.pathname.split('/')[1]
  if (
    differentAppSubpaths.indexOf(newURLFirstSubpath) > -1 ||
    differentAppSubpaths.indexOf(currentURLFirstSubpath) > -1
  ) {
    return newURLFirstSubpath !== currentURLFirstSubpath
  }

  // Otherwise, assume we're on the same app.
  return false
}

// TODO: deprecate using this directly. Instead, just rely
//   on navigation's goTo and replaceUrl, which handles
//   external redirects intelligently.
/**
 * Set window.location to a new URL
 * @param {String} newURL - The URL to navigate to
 * @return {undefined}
 */
export const externalRedirect = externalURL => {
  window.location = externalURL
}

export const isAbsoluteURL = url =>
  !!(url.startsWith('http://') || url.startsWith('https://'))
