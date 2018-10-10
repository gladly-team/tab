
import adsEnabled from 'js/ads/adsEnabledStatus'
import googleDisplayAd from 'js/ads/google/googleDisplayAd'
import mockDisplayAd from 'js/ads/mockDisplayAd'

export default (adId) => {
  if (adsEnabled()) {
    googleDisplayAd(adId)
  } else {
    mockDisplayAd(adId)
  }
}
