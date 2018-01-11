/* globals apstag */

// Should be the same as the value in prebidConfig
const PREBID_TIMEOUT = 1000

export default function () {
  (function (a9, a, p, s, t, A, g) {
    if (a[a9]) return; function q (c, r) { a[a9]._Q.push([c, r]) }a[a9] = {init: function () { q('i', arguments) }, fetchBids: function () { q('f', arguments) }, setDisplayBids: function () {}, _Q: []}; A = p.createElement(s); A.async = !0; A.src = t; g = p.getElementsByTagName(s)[0]; g.parentNode.insertBefore(A, g)
  })('apstag', window, document, 'script', '//c.amazon-adsystem.com/aax2/apstag.js')

  // BEGIN: profile and debug ad performance
  var adPerfKey = 'amazonJsFetch'
  var adPerfName = 'Amazon apstag fetch'
  var adPerfLogs = window.adPerfLogs || {}
  var adPerfTime = window.performance.now()
  adPerfLogs[adPerfKey] = {
    time: adPerfTime,
    name: adPerfName
  }
  console.log('Adperf: ' + adPerfName, adPerfTime)
  // END: profile and debug ad performance

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
      // BEGIN: profile and debug ad performance
      var adPerfKey = 'amazonBidsReturned'
      var adPerfName = 'Amazon bids returned'
      var adPerfLogs = window.adPerfLogs || {}
      var adPerfTime = window.performance.now()
      adPerfLogs[adPerfKey] = {
        time: adPerfTime,
        name: adPerfName
      }
      console.log('Adperf: ' + adPerfName, adPerfTime)
      // END: profile and debug ad performance

      googletag.cmd.push(function () {
        // Set DFP targeting.
        apstag.setDisplayBids()
      })
    })
}
