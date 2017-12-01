
import adsEnabled from './adsEnabledStatus'
import { setUpGoogleTag } from './google/googleTag'
import prebid from './prebid/prebidModule'
import prebidConfig from './prebid/prebidConfig'
import googleTagManager from './google/googleTagManager'
import googleAdSlotDefinitions from './google/googleAdSlotDefinitions'
import amazonBidder from './amazon/amazonBidder'
import openxConfig from './openx/openxConfig'

if (adsEnabled) {
  setUpGoogleTag()
  prebid()
  prebidConfig()
  amazonBidder()
  openxConfig()
  googleTagManager()
  googleAdSlotDefinitions()
} else {
  // console.log('Ads are disabled. Not setting up DFP or Prebid.')
}
