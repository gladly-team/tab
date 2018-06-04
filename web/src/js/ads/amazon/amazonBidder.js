
import getAmazonTag from './getAmazonTag'
import {
  BIDDER_TIMEOUT,
  CONSENT_MANAGEMENT_TIMEOUT
} from '../adSettings'

// Save returned Amazon bids.
var amazonBids

/**
 * If there are Amazon bids, store them in the tabforacause
 * global object for use with analytics. Only do this if the
 * Amazon bids return early enough to be included in the ad
 * server request; otherwise, the bids are not meaningful.
 * @return {undefined}
 */
export const storeAmazonBids = () => {
  // Bid object structure:
  // {
  //   amznbid: '1',
  //   amzniid: 'some-id',
  //   amznp: '1',
  //   amznsz: '0x0',
  //   size: '0x0',
  //   slotID: 'div-gpt-ad-123456789-0'
  // }
  try {
    if (amazonBids && amazonBids.length) {
      amazonBids.forEach((bid) => {
        window.tabforacause.ads.amazonBids[bid.slotID] = bid
      })
    }
  } catch (e) {
    console.error('Could not store Amazon bids', e)
  }
}

/**
 * Return a promise that resolves when the Amazon bids
 * return or the request times out. See:
 * https://ams.amazon.com/webpublisher/uam/docs/web-integration-documentation/integration-guide/javascript-guide/api-reference.html
 * @return {Promise<undefined>} Resolves when the Amazon
 *   bid requests return or time out.
 */
function initApstag () {
  const apstag = getAmazonTag()
  return new Promise((resolve, reject) => {
    apstag.init({
      pubID: '3397',
      adServer: 'googletag',
      gdpr: {
        cmpTimeout: CONSENT_MANAGEMENT_TIMEOUT
      }
    })
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
        timeout: BIDDER_TIMEOUT
      },
      function (bids) {
        amazonBids = bids
        handleAuctionEnd()
      })

    function handleAuctionEnd () {
      resolve()
    }
  })
}

export default () => {
  return initApstag()
}
