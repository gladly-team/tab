import moment from 'moment'
import {
  getTabsOpenedToday,
  getBrowserExtensionInstallTime,
  hasUserDismissedAdExplanation,
} from 'js/utils/local-user-data-mgr'

const MAX_TABS_WITH_ADS = 150

// "Vertical ad" = the ad that's typically rectangular
// or taller than it is wide. Historically, the right-side
// rectangle ad.
export const VERTICAL_AD_UNIT_ID = '/43865596/HBTR'
export const VERTICAL_AD_SLOT_DOM_ID = 'div-gpt-ad-1464385742501-0'

// "Second vertical ad" = the extra rectangle ad.
export const SECOND_VERTICAL_AD_UNIT_ID = '/43865596/HBTR2'
export const SECOND_VERTICAL_AD_SLOT_DOM_ID = 'div-gpt-ad-1539903223131-0'

// "Horizontal ad" = the ad that's typically wider than
// it is tall. Historically, the bottom long leaderboard ad.
export const HORIZONTAL_AD_UNIT_ID = '/43865596/HBTL'
export const HORIZONTAL_AD_SLOT_DOM_ID = 'div-gpt-ad-1464385677836-0'

export const areAdsEnabled = () => {
  if (!(process.env.REACT_APP_ADS_ENABLED === 'true')) {
    return false
  }

  // If the user has exceeded the daily tab maximum,
  // do not show ads.
  // https://github.com/gladly-team/tab/issues/202
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

/**
 * Get the number of banner ads to show on the new tab page.
 * @return {Number} The number of ads
 */
export const getNumberOfAdsToShow = () => {
  return shouldShowOneAd() ? 1 : 3
}
