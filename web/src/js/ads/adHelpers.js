import moment from 'moment'
import {
  getTabsOpenedToday,
  getBrowserExtensionInstallTime,
  hasUserDismissedAdExplanation,
} from 'js/utils/local-user-data-mgr'
import { getAvailableAdUnits } from 'tab-ads'

const newTabAdUnitOptions = getAvailableAdUnits()

// TODO: use this internally; don't export
/**
 * Get the number of banner ads to show on the new tab page.
 * @return {Number} The number of ads
 */
export const getNumberOfAdsToShow = () => {
  return shouldShowOneAd() ? 1 : 3
}

// TODO: roll "getNumberOfAdsToShow" into this
/**
 * Return an object of ad units we should display.
 * @return {Object} AdUnitsInfo
 * @return {Object|null} AdUnitsInfo.leaderboard - a tab-ads ad unit
 *   definition for the 728x90 ad, or null if we shouldn't show that
 *   ad unit
 * @return {Object|null} AdUnitsInfo.rectangleAdPrimary - a tab-ads
 *   ad unit definition for the first 300x250 ad, or null if we
 *   shouldn't show that ad unit
 * @return {Object|null} AdUnitsInfo.rectangleAdSecondary - a tab-ads
 *   ad unit definition for the second 300x250 ad, or null if we
 *   shouldn't show that ad unit
 */
export const getAdUnits = () => {
  const {
    leaderboard,
    rectangleAdPrimary,
    rectangleAdSecondary,
  } = newTabAdUnitOptions
  return {
    leaderboard,
    rectangleAdPrimary,
    rectangleAdSecondary,
  }
}

export const areAdsEnabled = () => {
  if (!(process.env.REACT_APP_ADS_ENABLED === 'true')) {
    return false
  }

  // If the user has exceeded the daily tab maximum,
  // do not show ads.
  // https://github.com/gladly-team/tab/issues/202
  const MAX_TABS_WITH_ADS = 150
  const tabsOpenedToday = getTabsOpenedToday()
  return tabsOpenedToday < MAX_TABS_WITH_ADS
}

export const showMockAds = () => {
  // TODO: use NODE_ENV and env var to enable in development
  return false
}

/**
 * Determine if we should show the explanation that the ads raise
 * money for charity. We'll show it to users for the first X hours
 * after they join.
 * @return {Boolean} Whether to show one ad.
 */
export const shouldShowAdExplanation = () => {
  const hoursToShow = 4
  const installTime = getBrowserExtensionInstallTime()
  const joinedRecently =
    !!installTime && moment().diff(installTime, 'hours') < hoursToShow
  return !!(joinedRecently && !hasUserDismissedAdExplanation())
}

/**
 * Determine if we should show only one ad. We'll show one ad to
 * users for the first X hours after they join.
 * @return {Boolean} Whether to show one ad.
 */
const shouldShowOneAd = () => {
  const installTime = getBrowserExtensionInstallTime()
  const joinedRecently =
    !!installTime && moment().diff(installTime, 'hours') < 24
  return !!joinedRecently
}
