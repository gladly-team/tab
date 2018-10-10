
import { getTabsOpenedToday } from 'js/utils/local-user-data-mgr'

const MAX_TABS_WITH_ADS = 150

export default () => {
  if (!(process.env.ADS_ENABLED === 'true')) {
    return false
  }

  // If the user has exceeded the daily tab maximum,
  // do not show ads.
  // https://github.com/gladly-team/tab/issues/202
  const tabsOpenedToday = getTabsOpenedToday()
  return tabsOpenedToday < MAX_TABS_WITH_ADS
}
