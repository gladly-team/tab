
import moment from 'moment'
import localStorageMgr from 'utils/localstorage-mgr'
import {
  STORAGE_TABS_RECENT_DAY_COUNT,
  STORAGE_TABS_LAST_TAB_OPENED_DATE
} from '../constants'

/**
 * Get the count of tabs opened today (UTC day) from localStorage. If no
 * value exists in storage, return zero.
 * @returns {number} The user's tab count
 */
const getTabsOpenedTodayFromStorage = () => {
  const tabCountStr = localStorageMgr.getItem(STORAGE_TABS_RECENT_DAY_COUNT)
  const tabCountParsed = parseInt(tabCountStr, 10)
  const tabCount = isNaN(tabCountParsed) ? 0 : tabCountParsed
  return tabCount
}

/**
 * Get the count of tabs opened today (UTC day) from localStorage. If no
 * value exists in storage, return zero.
 * @returns {number} The user's tab count
 */
export const getTabsOpenedToday = function () {
  // An ISO timestamp
  const tabCountDate = localStorageMgr.getItem(STORAGE_TABS_LAST_TAB_OPENED_DATE)

  // If no current date, assume no tabs have been opened today.
  if (!tabCountDate) {
    return 0
  }

  // If the current date is the same as the most recent date a
  // tab was opened, it is not the first tab today.
  const isFirstTabToday = (
    moment(tabCountDate).utc().format('LL') !==
    moment().utc().format('LL')
  )
  if (isFirstTabToday) {
    return 0
  }
  return getTabsOpenedTodayFromStorage()
}
