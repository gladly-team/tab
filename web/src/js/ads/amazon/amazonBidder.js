/* globals apstag */

import { getConsentString } from '../consentManagement'

// Should be the same as the value in prebidConfig.
const PREBID_TIMEOUT = 1000

// Time to wait for the consent management platform (CMP)
// to respond.
var consentManagementTimeoutMs = 5000
var cmpTimer

async function initApstag (requiresConsentManagement, consentString = null) {
  apstag.init({
    pubID: '3397',
    adServer: 'googletag',
    // Pass GDPR consent
    // https://ams.amazon.com/webpublisher/uam/docs/web-integration-documentation/integration-guide/javascript-guide/api-reference.html
    ...requiresConsentManagement && {
      gdpr: {
        enabled: true,
        consent: consentString
      }
    }
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

export default async (isInEU) => {
  // Run apstag JS
  require('./apstag')

  const requiresConsentManagement = !!isInEU

  // If we need to get the consent string, do so before
  // initializing apstag.
  if (requiresConsentManagement) {
    // If the CMP takes too long to respond, initialize apstag
    // without the consent string.
    cmpTimer = setTimeout(() => {
      initApstag(true, null)
    }, consentManagementTimeoutMs)

    // Try to get the consent string from the CMP.
    try {
      const consentString = await getConsentString()
      clearTimeout(cmpTimer)
      initApstag(true, consentString)
    } catch (e) {
      console.error(e)
      clearTimeout(cmpTimer)
      initApstag(true, null)
    }
  } else {
    initApstag(false)
  }
}
