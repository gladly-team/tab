import adsEnabled from './adsEnabledStatus'
import prebid from './prebid/prebidModule'
import prebidConfig from './prebid/prebidConfig'
import amazonBidder from './amazon/amazonBidder'
import handleAdsLoaded from './handleAdsLoaded'
import { isInEuropeanUnion } from 'utils/client-location'
import consentManagementInit from 'ads/consentManagementInit'

const loadAdCode = (isInEU) => {
  if (adsEnabled()) {
    handleAdsLoaded()
    amazonBidder(isInEU)
    prebid()
    prebidConfig(isInEU)
  } else {
  // console.log('Ads are disabled. Not setting up DFP or Prebid.')
  }
}

// TODO: restrict to authed paths
// Initialize consent management if we're not on the login or
// sign-up pages. We ask for consent after the user has
// authenticated so we can log consent with their user ID.
consentManagementInit()

// Determine if the user is in the EU, which may affect the
// ads we show.
isInEuropeanUnion()
  .then((isInEU) => {
    loadAdCode(isInEU)
  })
  // eslint-disable-next-line handle-callback-err
  .catch((err) => {
    // Assume not in EU.
    loadAdCode(false)
  })
