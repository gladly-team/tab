
import adsEnabled from './adsEnabledStatus'
import { setUpGoogleTag } from './google/googleTag'
import prebid from './prebid/prebidModule'
import prebidConfig from './prebid/prebidConfig'
import googleTagManager from './google/googleTagManager'
import googleAdSlotDefinitions from './google/googleAdSlotDefinitions'
import amazonBidder from './amazon/amazonBidder'

// BEGIN: profile and debug ad performance
var adPerfKey = 'adsJs'
var adPerfName = 'ads.js load'
var adPerfLogs = window.adPerfLogs || {}
var adPerfTime = window.performance.now()
adPerfLogs[adPerfKey] = {
  time: adPerfTime,
  name: adPerfName
}
console.log('Adperf: ' + adPerfName, adPerfTime)
// END: profile and debug ad performance

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
