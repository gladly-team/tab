
import adsEnabled from './adsEnabledStatus'
import prebid from './prebid/prebidModule'
import prebidConfig from './prebid/prebidConfig'
import googleTagManager from './google/googleTagManager'
import googleAdSlotDefinitions from './google/googleAdSlotDefinitions'
import openxConfig from './openx/openxConfig'

if (adsEnabled) {
  prebid()
  prebidConfig()
  googleTagManager()
  openxConfig()
  googleAdSlotDefinitions()
} else {
  // console.log('Ads are disabled. Not setting up DFP or Prebid.')
}
