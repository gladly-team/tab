
import adsEnabled from './adsEnabledStatus'
import { setUpGoogleTag } from './google/googleTag'
import prebid from './prebid/prebidModule'
import prebidConfig from './prebid/prebidConfig'
import googleTagManager from './google/googleTagManager'
import googleAdSlotDefinitions from './google/googleAdSlotDefinitions'
import amazonBidder from './amazon/amazonBidder'

if (adsEnabled) {
  setUpGoogleTag()
  amazonBidder()
  prebid()
  prebidConfig()
  googleTagManager()
  googleAdSlotDefinitions()
} else {
  // console.log('Ads are disabled. Not setting up DFP or Prebid.')
}
