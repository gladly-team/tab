/* globals apstag */

import getGoogleTag from '../google/getGoogleTag'

// Should be the same as the value in prebidConfig.
const PREBID_TIMEOUT = 1000

// Time to wait for the consent management platform (CMP)
// to respond.
var consentManagementTimeoutMs = 50

// https://ams.amazon.com/webpublisher/uam/docs/web-integration-documentation/integration-guide/javascript-guide/api-reference.html
function initApstag () {
  apstag.init({
    pubID: '3397',
    adServer: 'googletag',
    gdpr: {
      cmpTimeout: consentManagementTimeoutMs
    }
  })
  const googletag = getGoogleTag()
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

        // Store Amazon bids. Bid object structure:
        // {
        //   amznbid: '1',
        //   amzniid: 'some-id',
        //   amznp: '1',
        //   amznsz: '0x0',
        //   size: '0x0',
        //   slotID: 'div-gpt-ad-123456789-0'
        // }
        try {
          if (bids && bids.length) {
            bids.forEach((bid) => {
              window.tabforacause.ads.amazonBids[bid.slotID] = bid
            })
          }
        } catch (e) {
          console.error('Could not store Amazon bids', e)
        }

        // Note: the ads refresh is handled by Prebid.
        // googletag.pubads().refresh()
      })
    })
}

export default () => {
  // Run apstag JS
  require('./apstag')
  initApstag()
}
