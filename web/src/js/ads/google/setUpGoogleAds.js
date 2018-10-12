
import getGoogleTag from 'js/ads/google/getGoogleTag'
import {
  getVerticalAdSizes,
  getHorizontalAdSizes,
  VERTICAL_AD_UNIT_ID,
  VERTICAL_AD_SLOT_DOM_ID,
  HORIZONTAL_AD_UNIT_ID,
  HORIZONTAL_AD_SLOT_DOM_ID
} from 'js/ads/adSettings'

export default () => {
  const googletag = getGoogleTag()
  const horizontalAdSizes = getHorizontalAdSizes()
  const verticalAdSizes = getVerticalAdSizes()
  googletag.cmd.push(function () {
    googletag.defineSlot(
      HORIZONTAL_AD_UNIT_ID,
      horizontalAdSizes,
      HORIZONTAL_AD_SLOT_DOM_ID
    ).addService(googletag.pubads())
    googletag.defineSlot(
      VERTICAL_AD_UNIT_ID,
      verticalAdSizes,
      VERTICAL_AD_SLOT_DOM_ID
    ).addService(googletag.pubads())
    googletag.pubads().enableSingleRequest()
    googletag.enableServices()
  })
}
