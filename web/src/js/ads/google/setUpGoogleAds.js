
import getGoogleTag from 'js/ads/google/getGoogleTag'
import {
  getVerticalAdSizes,
  getHorizontalAdSizes,
  VERTICAL_AD_ID,
  VERTICAL_AD_SLOT_ID,
  HORIZONTAL_AD_ID,
  HORIZONTAL_AD_SLOT_ID
} from 'js/ads/adSettings'

export default () => {
  const googletag = getGoogleTag()
  const horizontalAdSizes = getHorizontalAdSizes()
  const verticalAdSizes = getVerticalAdSizes()
  googletag.cmd.push(function () {
    googletag.defineSlot(
      HORIZONTAL_AD_ID,
      horizontalAdSizes,
      HORIZONTAL_AD_SLOT_ID
    ).addService(googletag.pubads())
    googletag.defineSlot(
      VERTICAL_AD_ID,
      verticalAdSizes,
      VERTICAL_AD_SLOT_ID
    ).addService(googletag.pubads())
    googletag.pubads().enableSingleRequest()
    googletag.enableServices()
  })
}
