import getAmazonTag from 'js/ads/amazon/getAmazonTag'
import {
  getNumberOfAdsToShow,
  getVerticalAdSizes,
  getHorizontalAdSizes,
  BIDDER_TIMEOUT,
  CONSENT_MANAGEMENT_TIMEOUT,
  VERTICAL_AD_SLOT_DOM_ID,
  SECOND_VERTICAL_AD_SLOT_DOM_ID,
  HORIZONTAL_AD_SLOT_DOM_ID,
} from 'js/ads/adSettings'
import logger from 'js/utils/logger'

// Save returned Amazon bids.
var amazonBids

// Make sure we only add the event listener once.
var addedCreativeEventListener = false

// WIP
// TODO: call when initializing apstag, test, write tests
// See the ads/amazon/README.md for more info.
const addListenerForAmazonCreativeMessage = () => {
  if (addedCreativeEventListener) {
    return
  }
  addedCreativeEventListener = true
  const GOOGLE_ADSERVER_DOMAIN = 'tpc.googlesyndication.com'
  window.addEventListener(
    'message',
    event => {
      // Only accept messages from Google's SafeFrame.
      if (event.origin !== `https://${GOOGLE_ADSERVER_DOMAIN}`) {
        return
      }
      const { data } = event
      const apstag = getAmazonTag()
      // Make sure the message is from apstag.
      if (!data || data.type !== 'apstag') {
        return
      }

      if (!apstag) {
        console.error('The apstag window variable is not defined.')
        return
      }

      // Make sure the message includes an ad ID.
      if (!data.adId) {
        console.error(
          'The message from apstag did not contain an "adId" field.'
        )
        return
      }

      console.log('Parent page received message.')

      // Render the ad.
      // console.log('This is when we would render the apstag ad!')
      // console.log(event.source)
      event.source.postMessage(
        {
          type: 'apstagResponse',
          thing: 'foo',
        },
        `https://${GOOGLE_ADSERVER_DOMAIN}`
      )
      console.log('Sent message with type "apstagResponse"')
      // apstag.renderImp(event.source.document, data.adId)
    },
    false
  )
}

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
      amazonBids.forEach(bid => {
        window.tabforacause.ads.amazonBids[bid.slotID] = bid
      })
    }
  } catch (e) {
    logger.error(e)
  }
}

/**
 * Return a promise that resolves when the Amazon bids
 * return or the request times out. See:
 * https://ams.amazon.com/webpublisher/uam/docs/web-integration-documentation/integration-guide/javascript-guide/api-reference.html
 * @return {Promise<undefined>} Resolves when the Amazon
 *   bid requests return or time out.
 */
function initApstag() {
  const numAds = getNumberOfAdsToShow()
  if (numAds < 1) {
    return
  }
  addListenerForAmazonCreativeMessage()
  const apstag = getAmazonTag()

  // Only get bids for the horizontal ad slot if only
  // one ad is enabled.
  const slots = [
    {
      slotID: HORIZONTAL_AD_SLOT_DOM_ID,
      sizes: getHorizontalAdSizes(),
    },
  ]
  if (numAds > 1) {
    slots.push({
      slotID: VERTICAL_AD_SLOT_DOM_ID,
      sizes: getVerticalAdSizes(),
    })
  }
  if (numAds > 2) {
    slots.push({
      slotID: SECOND_VERTICAL_AD_SLOT_DOM_ID,
      sizes: getVerticalAdSizes(),
    })
  }

  return new Promise((resolve, reject) => {
    apstag.init({
      pubID: '3397',
      adServer: 'googletag',
      gdpr: {
        cmpTimeout: CONSENT_MANAGEMENT_TIMEOUT,
      },
    })
    apstag.fetchBids(
      {
        slots: slots,
        timeout: BIDDER_TIMEOUT,
      },
      function(bids) {
        amazonBids = bids
        handleAuctionEnd()
      }
    )

    function handleAuctionEnd() {
      resolve()
    }
  })
}

export default () => {
  return initApstag()
}
