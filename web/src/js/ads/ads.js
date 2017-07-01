
import prebid from './prebid/prebidModule'
import prebidConfig from './prebid/config'
import googleTagManager from './googleTagManager'
import googleAdSlotDefinitions from './googleAdSlotDefinitions'
import openxConfig from './openxConfig'

// TODO: env var
const adsEnabled = true

if (adsEnabled) {
  prebid()
  prebidConfig()
  googleTagManager()
  googleAdSlotDefinitions()
  openxConfig()
} else {
  console.log('Ads are disabled. Not setting up DFP or Prebid.')
}
