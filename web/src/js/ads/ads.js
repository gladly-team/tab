
import adsEnabled from './adsEnabledStatus'
import prebid from './prebid/prebidModule'
import prebidConfig from './prebid/prebidConfig'
import amazonBidder from './amazon/amazonBidder'

if (adsEnabled) {
  amazonBidder()
  prebid()
  prebidConfig()
} else {
  // console.log('Ads are disabled. Not setting up DFP or Prebid.')
}
