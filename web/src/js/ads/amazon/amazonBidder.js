/* globals apstag */

// Should be the same as the value in prebidConfig
const PREBID_TIMEOUT = 1000

export default function () {
  // Run apstag JS
  require('./apstag')

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
      googletag.cmd.push(function () {
        // Set DFP targeting.
        apstag.setDisplayBids()

        // Note: the ads refresh is handled by Prebid.
        // googletag.pubads().refresh()
      })
    })
}
