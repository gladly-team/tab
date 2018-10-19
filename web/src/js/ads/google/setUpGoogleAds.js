
import getGoogleTag from 'js/ads/google/getGoogleTag'
import {
  getNumberOfAdsToShow,
  getVerticalAdSizes,
  getHorizontalAdSizes,
  VERTICAL_AD_UNIT_ID,
  VERTICAL_AD_SLOT_DOM_ID,
  SECOND_VERTICAL_AD_UNIT_ID,
  SECOND_VERTICAL_AD_SLOT_DOM_ID,
  HORIZONTAL_AD_UNIT_ID,
  HORIZONTAL_AD_SLOT_DOM_ID
} from 'js/ads/adSettings'

export default () => {
  const googletag = getGoogleTag()
  const horizontalAdSizes = getHorizontalAdSizes()
  const verticalAdSizes = getVerticalAdSizes()
  const numAdsToShow = getNumberOfAdsToShow()
  googletag.cmd.push(function () {
    if (numAdsToShow > 0) {
      // Leaderboard
      googletag.defineSlot(
        HORIZONTAL_AD_UNIT_ID,
        horizontalAdSizes,
        HORIZONTAL_AD_SLOT_DOM_ID
      ).addService(googletag.pubads())
    }
    if (numAdsToShow > 1) {
      // Rectangle #1
      googletag.defineSlot(
        VERTICAL_AD_UNIT_ID,
        verticalAdSizes,
        VERTICAL_AD_SLOT_DOM_ID
      ).addService(googletag.pubads())
    }
    if (numAdsToShow > 2) {
      // Rectangle #2
      googletag.defineSlot(
        SECOND_VERTICAL_AD_UNIT_ID,
        verticalAdSizes,
        SECOND_VERTICAL_AD_SLOT_DOM_ID
      ).addService(googletag.pubads())
    }
    googletag.pubads().enableSingleRequest()
    googletag.enableServices()
  })
}
