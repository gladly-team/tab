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

/**
 * Add a message listener for messages from apstag ad creative
 * served inside a Google SafeFrame.
 * This is a temporary fix for the issue described here:
 *   https://github.com/gladly-team/tab/issues/481
 * See the ads/amazon/README.md for more info.
 * We should remove this code and update the creative in our
 * ad server as soon as the ABP bug is fixed.
 * @return {undefined}
 */
const addListenerForAmazonCreativeMessage = () => {
  try {
    const GOOGLE_ADSERVER_DOMAIN = 'tpc.googlesyndication.com'
    window.addEventListener(
      'message',
      event => {
        // Only accept messages from Google's SafeFrame.
        if (event.origin !== `https://${GOOGLE_ADSERVER_DOMAIN}`) {
          return false
        }
        const { data } = event
        const apstag = getAmazonTag()

        // Make sure the message is from apstag.
        if (!data || data.type !== 'apstag') {
          return false
        }

        // Make sure the apstag JS has loaded on the parent window.
        if (!apstag) {
          console.error('The apstag window variable is not defined.')
          return false
        }

        // Make sure the posted message from the ad creative
        // includes an ad ID.
        if (!data.adId) {
          console.error(
            'The message from apstag did not contain an "adId" field.'
          )
          return false
        }

        // Create a document that we'll render the ad into.
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        document.getElementById('apstag-iframes').append(iframe)
        const mockDocument = iframe.contentDocument
        apstag.renderImp(mockDocument, data.adId)

        // Pass the ad-rendered document attributes to the
        // SafeFrame so it can render it into the iframe.
        const adDocumentData = {
          title: mockDocument.title,
          headHTML: mockDocument.head ? mockDocument.head.innerHTML : '',
          bodyHTML: mockDocument.body ? mockDocument.body.innerHTML : '',
          cookie: mockDocument.cookie,
        }
        event.source.postMessage(
          {
            type: 'apstagResponse',
            adDocumentData: adDocumentData,
          },
          `https://${GOOGLE_ADSERVER_DOMAIN}`
        )
        iframe.remove()
        return true
      },
      false
    )
  } catch (e) {
    console.error(e)
  }
}

/**
 * This is ad creative for apstag ads served from Google Ad
 * Manager. This code is only here for testing.
 * This is a temporary fix for the issue described here:
 *   https://github.com/gladly-team/tab/issues/481
 * We should remove this code and update the creative in our
 * ad server as soon as the ABP bug is fixed.
 * @return {undefined}
 */
export const apstagSafeFrameCreativeCode = () => {
  try {
    // Listen for a response from the parent page.
    window.addEventListener(
      'message',
      function(event) {
        // Make sure the message comes from one of our domains.
        if (
          [
            'https://tab.gladly.io',
            'https://dev-tab2017.gladly.io',
            'https://localhost:3000',
            'https://local-dev-tab.gladly.io:3000',
          ].indexOf(event.origin) < 0
        ) {
          return false
        }

        // Make sure this is an apstag response.
        if (!event.data || event.data.type !== 'apstagResponse') {
          return false
        }

        if (!event.data || !event.data.adDocumentData) {
          console.error(
            'The message from the parent did not contain an "adDocumentData" object.'
          )
          return false
        }
        var adDocumentData = event.data.adDocumentData

        // Update the ad document with the rendered HTML.
        window.document.cookie = adDocumentData.cookie
        window.document.head.innerHTML = adDocumentData.headHTML
        window.document.title = adDocumentData.title
        window.document.body.innerHTML = adDocumentData.bodyHTML
        return true
      },
      false
    )

    // Message the parent page.
    window.parent.postMessage(
      {
        type: 'apstag',
        // Our ad server replaces this placeholder.
        adId: '%%PATTERN:amzniid%%',
      },
      '*'
    )
  } catch (e) {
    console.error(e)
  }
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
