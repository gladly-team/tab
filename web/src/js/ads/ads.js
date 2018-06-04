import adsEnabled from './adsEnabledStatus'
import amazonBidder, { storeAmazonBids } from './amazon/amazonBidder'
import getAmazonTag from './amazon/getAmazonTag'
import getGoogleTag from './google/getGoogleTag'
import getPrebidPbjs from './prebid/getPrebidPbjs'
import handleAdsLoaded from './handleAdsLoaded'
import prebidConfig from './prebid/prebidConfig'
import {
  AUCTION_TIMEOUT
} from './adSettings'

// Enabled bidders.
const BIDDER_PREBID = 'prebid'
const BIDDER_AMAZON = 'amazon'
const bidders = [BIDDER_PREBID, BIDDER_AMAZON]

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
  adserverRequestSent: false
}

/**
 * Add bidder targeting to googletag and send a request
 * to DFP to fetch ads.
 * @return {boolean}
 */
function sendAdserverRequest () {
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
function allBiddersBack () {
  return bidders
    .map(function (bidder) {
      return requestManager.bidders[bidder]
    })
    // Remove false values (bidders that have not responded).
    .filter(Boolean)
    // If length is equal to bidders, all bidders are back.
    .length === bidders.length
}

/**
 * Mark a bidder as having returned bids. If all bidders have
 * returned bids, call the ad server.
 * @return {undefined}
 */
function bidderCompleted (bidder) {
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
  if (adsEnabled()) {
    // Track loaded ads for analytics
    handleAdsLoaded()

    // Amazon
    amazonBidder()
      .then(() => {
        bidderCompleted(BIDDER_AMAZON)
      })
      .catch((err) => {
        console.error(err)
        bidderCompleted(BIDDER_AMAZON)
      })

    // Prebid
    prebidConfig()
      .then(() => {
        bidderCompleted(BIDDER_PREBID)
      })
      .catch((err) => {
        console.error(err)
        bidderCompleted(BIDDER_PREBID)
      })
  } else {
    // console.log('Ads are disabled. Not setting up DFP or Prebid.')
  }
}

// Call the ad server after some time to avoid too long
// for bid responses.
setTimeout(() => {
  sendAdserverRequest()
}, AUCTION_TIMEOUT)

loadAdCode()
