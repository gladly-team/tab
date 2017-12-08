/* globals apstag */

// Should be the same as the value in prebidConfig
const PREBID_TIMEOUT = 1000

export default function () {
  (function (a9, a, p, s, t, A, g) {
    if (a[a9]) return; function q (c, r) { a[a9]._Q.push([c, r]) }a[a9] = {init: function () { q('i', arguments) }, fetchBids: function () { q('f', arguments) }, setDisplayBids: function () {}, _Q: []}; A = p.createElement(s); A.async = !0; A.src = t; g = p.getElementsByTagName(s)[0]; g.parentNode.insertBefore(A, g)
  })('apstag', window, document, 'script', '//c.amazon-adsystem.com/aax2/apstag.js')

  apstag.init({
    pubID: '3397',
    adServer: 'googletag'
  })
  const googletag = window.googletag || {}
  googletag.cmd = googletag.cmd || []
  apstag.fetchBids(
    {
      slots: [
        {
          slotID: 'div-gpt-ad-1464385742501-0',
          sizes: [[300, 250]]
        },
        {
          slotID: 'div-gpt-ad-1464385677836-0',
          sizes: [[728, 90]]
        }
      ],
      timeout: PREBID_TIMEOUT
    },
    function (bids) {
      var timeDiff = null
      if (window.adStartTime) {
        timeDiff = Date.now() - window.adStartTime
      }
      console.log('Bids: Amazon TAM bids back. Milliseconds:', timeDiff)
      googletag.cmd.push(function () {
        // Set DFP targeting.
        apstag.setDisplayBids()
      })
    })
}
