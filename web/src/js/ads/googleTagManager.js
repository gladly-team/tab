
// Google Tag Manager
export default function () {
  var googletag = window.googletag || {}
  // We're not running in global scope, so make sure to
  // assign to the window.
  if (!window.googletag) {
    window.googletag = googletag
  }
  googletag.cmd = googletag.cmd || [];
  (function () {
    var gads = document.createElement('script')
    gads.async = true
    gads.type = 'text/javascript'
    var useSSL = document.location.protocol === 'https:'
    gads.src = (useSSL ? 'https:' : 'http:') +
      '//www.googletagservices.com/tag/js/gpt.js'
    var node = document.getElementsByTagName('script')[0]
    node.parentNode.insertBefore(gads, node)
  })()
}
