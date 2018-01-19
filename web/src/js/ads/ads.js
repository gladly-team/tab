
import adsEnabled from './adsEnabledStatus'
import prebid from './prebid/prebidModule'
import prebidConfig from './prebid/prebidConfig'
import amazonBidder from './amazon/amazonBidder'

// BEGIN: profile and debug ad performance
if (window.performance && window.performance.now) {
  var adPerfKey = 'adsJs'
  var adPerfName = 'ads.js load'
  var adPerfLogs = window.adPerfLogs || {}
  var adPerfTime = window.performance.now()
  adPerfLogs[adPerfKey] = {
    time: adPerfTime,
    name: adPerfName
  }
  console.log('Adperf: ' + adPerfName, adPerfTime)
}
// END: profile and debug ad performance

if (adsEnabled) {
  amazonBidder()
  prebid()
  prebidConfig()
} else {
  // console.log('Ads are disabled. Not setting up DFP or Prebid.')
}
