
export default function () {
  const googletag = window.googletag || {}
  googletag.cmd = googletag.cmd || []
  // We're not running in global scope, so make sure to
  // assign to the window.
  if (!window.googletag) {
    window.googletag = googletag
  }
  return googletag
}
