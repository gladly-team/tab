import getIndexExchangeTag from 'js/ads/indexExchange/getIndexExchangeTag'
import { getNumberOfAdsToShow, BIDDER_TIMEOUT } from 'js/ads/adSettings'
// import logger from 'js/utils/logger'

/**
 * Return a promise that resolves when the Index Exchange bid
 * responses return or the request times out. See:
 * https://kb.indexexchange.com/Wrapper/Installation/Universal_Library_Implementation.htm
 * @return {Promise<undefined>} Resolves when the Amazon
 *   bid requests return or time out.
 */
const fetchIndexExchangeDemand = () => {
  const numAds = getNumberOfAdsToShow()
  if (numAds < 1) {
    return
  }
  const ixTag = getIndexExchangeTag()

  // Only get bids for the horizontal ad slot if only
  // one ad is enabled.
  const slots = [{ htSlotName: 'd-1-728x90-atf-bottom-leaderboard' }]
  if (numAds > 1) {
    slots.push({ htSlotName: 'd-2-300x250-atf-middle-right_rectangle' })
  }
  if (numAds > 2) {
    slots.push({ htSlotName: 'd-3-300x250-atf-bottom-right_rectangle' })
  }

  return new Promise((resolve, reject) => {
    ixTag.retrieveDemand(slots, demand => {
      // TODO: handle demand and set targeting
      console.log(demand)
      handleAuctionEnd()
    })

    function handleAuctionEnd() {
      resolve()
    }

    // Resolve after some time to avoid waiting too long
    // for responses.
    setTimeout(() => {
      handleAuctionEnd()
    }, BIDDER_TIMEOUT)
  })
}

export default () => {
  return fetchIndexExchangeDemand()
}
