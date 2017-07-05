
export default function (adId) {
  // TODO: move this snippet into its own module
  var googletag = window.googletag || {}
  // We're not running in global scope, so make sure to
  // assign to the window.
  if (!window.googletag) {
    window.googletag = googletag
    googletag.cmd = googletag.cmd || []
  }
  googletag.cmd.push(() => {
    googletag.display(adId)
  })
}
