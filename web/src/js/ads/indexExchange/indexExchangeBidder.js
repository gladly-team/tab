import getIndexExchangeTag from 'js/ads/indexExchange/getIndexExchangeTag'
import {
  getNumberOfAdsToShow,
  BIDDER_TIMEOUT,
  VERTICAL_AD_UNIT_ID,
  SECOND_VERTICAL_AD_UNIT_ID,
  HORIZONTAL_AD_UNIT_ID,
} from 'js/ads/adSettings'
import getGoogleTag from 'js/ads/google/getGoogleTag'
import logger from 'js/utils/logger'
import { getTabGlobal } from 'js/utils/utils'

/**
 * If there are IX bids, store them in the tabforacause
 * global object for use with analytics. Only do this if the
 * bids return early enough to be included in the ad server
 request; otherwise, the bids are not meaningful.
 * @return {undefined}
 */
export const storeIndexExchangeBids = () => {
  // Bid object structure:
  // {
  //
  // }
  try {
    const tabGlobal = getTabGlobal()
    console.log(indexExchangeBids, tabGlobal)
  } catch (e) {
    logger.error(e)
  }
}

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

  // Key = the GAM ad unit; value = the Index Exchange ID
  const mapGAMSlotsToIXSlots = {
    // Bottom leaderboard
    [HORIZONTAL_AD_UNIT_ID]: 'd-1-728x90-atf-bottom-leaderboard',
    // Bottom-right rectangle ad
    [VERTICAL_AD_UNIT_ID]: 'd-3-300x250-atf-bottom-right_rectangle',
    // Second (upper) rectangle ad
    [SECOND_VERTICAL_AD_UNIT_ID]: 'd-2-300x250-atf-middle-right_rectangle',
  }

  // Only get bids for the number of ads we'll show.
  const IXSlots = [{ htSlotName: mapGAMSlotsToIXSlots[HORIZONTAL_AD_UNIT_ID] }]
  if (numAds > 1) {
    IXSlots.push({ htSlotName: mapGAMSlotsToIXSlots[VERTICAL_AD_UNIT_ID] })
  }
  if (numAds > 2) {
    IXSlots.push({
      htSlotName: mapGAMSlotsToIXSlots[SECOND_VERTICAL_AD_UNIT_ID],
    })
  }

  return new Promise((resolve, reject) => {
    // Note that Index Exchange hasn't documented the cmd
    // behavior so it may break.
    ixTag.cmd.push(() => {
      // console.log('Index Exchange: retrieving demand')

      // IX appears to reinitialize the variable on load.
      let ixTag = getIndexExchangeTag()

      // Fetch bid responses from Index Exchange.
      // Note: the current request is to a casalemedia URL.
      ixTag.retrieveDemand(IXSlots, demand => {
        // Set adserver targeting for any returned demand.
        // IX demand should set the IOM and ix_id parameters.
        try {
          if (demand && demand.slot) {
            const googletag = getGoogleTag()
            const tabGlobal = getTabGlobal()

            // Loop through defined GAM slots to set any targeting.
            googletag.cmd.push(() => {
              googletag
                .pubads()
                .getSlots()
                .forEach(googleSlot => {
                  const IXSlotName =
                    mapGAMSlotsToIXSlots[googleSlot.getAdUnitPath()]
                  if (!IXSlotName) {
                    // No Index Exchange unit for this Google slot.
                    return
                  }
                  const IXBidResponseArray = demand.slot[IXSlotName]
                  if (!IXBidResponseArray || !IXBidResponseArray.length) {
                    // No Index Exchange bid for this ad unit.
                    return
                  }
                  IXBidResponseArray.forEach(IXBidResponse => {
                    if (!IXBidResponse.targeting) {
                      // No IX targeting provided.
                      return
                    }
                    // Set IX targeting on this slot.
                    Object.keys(IXBidResponse.targeting).forEach(
                      targetingKey => {
                        // https://developers.google.com/doubleclick-gpt/reference#googletag.Slot_setTargeting
                        googleSlot.setTargeting(
                          targetingKey,
                          IXBidResponse.targeting[targetingKey]
                        )
                      }
                    )
                  })

                  // Store the bids for analytics.
                  try {
                    tabGlobal.ads.indexExchangeBids[
                      googleSlot.getSlotElementId()
                    ] = IXBidResponseArray
                  } catch (e) {
                    logger.error(e)
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
