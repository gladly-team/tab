
export const setUpGoogleTag = function () {
  var googletag = window.googletag || {}
  // We're not running in global scope, so make sure to
  // assign to the window.
  if (!window.googletag) {
    window.googletag = googletag
  }
  googletag.cmd = googletag.cmd || []
  return googletag
}
