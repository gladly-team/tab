import getIndexExchangeTag from 'js/ads/indexExchange/getIndexExchangeTag'
import { getNumberOfAdsToShow, BIDDER_TIMEOUT } from 'js/ads/adSettings'
import getGoogleTag from 'js/ads/google/getGoogleTag'
import logger from 'js/utils/logger'

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

  // Note: use ixTag.cmd.push because the JS may not have
  // loaded. Index Exchange hasn't documented the cmd
  // behavior so it may break.
  let ixTag = getIndexExchangeTag()

  // Only get bids for the horizontal ad slot if only
  // one ad is enabled.
  const slots = [{ htSlotName: 'd-1-728x90-atf-bottom-leaderboard' }]
  if (numAds > 1) {
    slots.push({ htSlotName: 'd-3-300x250-atf-bottom-right_rectangle' })
  }
  if (numAds > 2) {
    slots.push({ htSlotName: 'd-2-300x250-atf-middle-right_rectangle' })
  }

  return new Promise((resolve, reject) => {
    // Note that Index Exchange hasn't documented the cmd
    // behavior so it may break.
    ixTag.cmd.push(() => {
      // console.log('Index Exchange: retrieving demand')

      // IX appears to reinitialize the variable on load.
      let ixTag = getIndexExchangeTag()

      // Note: the current request is to a casalemedia URL.
      ixTag.retrieveDemand(slots, demand => {
        // console.log('Index Exchange: demand', demand)

        // Set adserver targeting for any returned demand.
        // IX demand should set the IOM and ix_id parameters.
        try {
          const googletag = getGoogleTag()
          if (demand && demand.slot) {
            slots.forEach(slot => {
              const slotBidResponseArray = demand.slot[slot.htSlotName]
              slotBidResponseArray.forEach(slotBidResponse => {
                if (slotBidResponse && slotBidResponse.targeting) {
                  Object.keys(slotBidResponse.targeting).forEach(
                    targetingKey => {
                      // FIXME: we need to set targeting on the specific slot.
                      // googletag.cmd.push(() => {
                      //   googletag.pubads().setTargeting(
                      //     targetingKey,
                      //     // IX's targeting value is an array with one string.
                      //     slotBidResponse.targeting[targetingKey][0]
                      //   )
                      // })
                    }
                  )
                }
              })
            })
          }
        } catch (e) {
          logger.error(e)
        }
        handleAuctionEnd()
      })
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
