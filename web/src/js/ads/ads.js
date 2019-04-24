import 'js/ads/prebid/prebid' // Prebid library code
import adsEnabled from 'js/ads/adsEnabledStatus'
import amazonBidder, { storeAmazonBids } from 'js/ads/amazon/amazonBidder'
import indexExchangeBidder from 'js/ads/indexExchange/indexExchangeBidder'
import getAmazonTag from 'js/ads/amazon/getAmazonTag'
import getGoogleTag from 'js/ads/google/getGoogleTag'
import setUpGoogleAds from 'js/ads/google/setUpGoogleAds'
import getPrebidPbjs from 'js/ads/prebid/getPrebidPbjs'
import handleAdsLoaded from 'js/ads/handleAdsLoaded'
import prebidConfig from 'js/ads/prebid/prebidConfig'
import { AUCTION_TIMEOUT } from 'js/ads/adSettings'
import logger from 'js/utils/logger'

// Enabled bidders.
const BIDDER_PREBID = 'prebid'
const BIDDER_AMAZON = 'amazon'
const BIDDER_IX = 'ix'

const bidders = [BIDDER_PREBID, BIDDER_AMAZON, BIDDER_IX]

// Keep track of which bidders have responded.
const requestManager = {
  // [bidder name]: {boolean} whether the bidder has
  //   returned a bid
  bidders: bidders.reduce((bidders, currentBidder) => {
    bidders[currentBidder] = false
    return bidders
  }, {}),

  // Whether we've already requested ads from the ad
  // server.
  adserverRequestSent: false,
}

/**
 * Add bidder targeting to googletag and send a request
 * to DFP to fetch ads.
 * @return {undefined}
 */
function sendAdserverRequest() {
  // Return if the request to the adserver was already sent.
  if (requestManager.adserverRequestSent === true) {
    return
  }
  requestManager.adserverRequestSent = true

  // For revenue analytics.
  if (requestManager.bidders[BIDDER_AMAZON]) {
    storeAmazonBids()
  }

  // Set targeting and make a request to DFP.
  const googletag = getGoogleTag()
  const apstag = getAmazonTag()
  const pbjs = getPrebidPbjs()
  googletag.cmd.push(() => {
    apstag.setDisplayBids()
    pbjs.setTargetingForGPTAsync()
    googletag.pubads().refresh()
  })
}

/**
 * Whether all bidders have returned bids.
 * @return {boolean}
 */
function allBiddersBack() {
  return (
    // If length is equal to bidders, all bidders are back.
    bidders
      .map(function(bidder) {
        return requestManager.bidders[bidder]
      })
      // Remove false values (bidders that have not responded).
      .filter(Boolean).length === bidders.length
  )
}

/**
 * Mark a bidder as having returned bids. If all bidders have
 * returned bids, call the ad server.
 * @return {undefined}
 */
function bidderCompleted(bidder) {
  // Return if the request to the adserver was already sent.
  if (requestManager.adserverRequestSent === true) {
    return
  }
  requestManager.bidders[bidder] = true
  if (allBiddersBack()) {
    sendAdserverRequest()
  }
}

/**
 * Initialize all bidders and make bid requests.
 * @return {undefined}
 */
const loadAdCode = () => {
  // Track loaded ads for analytics
  handleAdsLoaded()

  // Amazon
  amazonBidder()
    .then(() => {
      bidderCompleted(BIDDER_AMAZON)
    })
    .catch(err => {
      logger.error(err)
      bidderCompleted(BIDDER_AMAZON)
    })

  // Prebid
  prebidConfig()
    .then(() => {
      bidderCompleted(BIDDER_PREBID)
    })
    .catch(err => {
      logger.error(err)
      bidderCompleted(BIDDER_PREBID)
    })

  // Index Exchange
  indexExchangeBidder()
    .then(() => {
      bidderCompleted(BIDDER_IX)
    })
    .catch(err => {
      logger.error(err)
      bidderCompleted(BIDDER_IX)
    })
}

if (adsEnabled()) {
  // Define slots and enable ad services.
  setUpGoogleAds()

  // Call the ad server after some time to avoid waiting
  // too long for bid responses.
  setTimeout(() => {
    sendAdserverRequest()
  }, AUCTION_TIMEOUT)

  loadAdCode()
} else {
  // console.log('Ads are disabled. Not setting up DFP or Prebid.')
}
