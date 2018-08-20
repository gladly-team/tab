
import moment from 'moment'
import localStorageMgr from 'utils/localstorage-mgr'
import {
  STORAGE_APPROX_EXTENSION_INSTALL_TIME,
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
 * Get whether the user has opened a tab today, according to the tab
 * count in localStorage.
 * @returns {boolean} Whether the user has opened a tab today
 */
const hasUserOpenedTabToday = () => {
  // An ISO timestamp
  const tabCountDate = localStorageMgr.getItem(STORAGE_TABS_LAST_TAB_OPENED_DATE)

  // If no current date, assume no tabs have been opened today.
  if (!tabCountDate) {
    return 0
  }

  // If the current date is the same as the most recent date a
  // tab was opened, it is not the first tab today.
  const hasOpenedTabToday = (
    moment(tabCountDate).utc().format('LL') ===
    moment().utc().format('LL')
  )
  return hasOpenedTabToday
}

/**
 * Get the count of tabs opened today (UTC day) from localStorage. If no
 * value exists in storage, return zero.
 * @returns {number} The user's tab count
 */
export const getTabsOpenedToday = function () {
  if (!hasUserOpenedTabToday()) {
    return 0
  }
  return getTabsOpenedTodayFromStorage()
}

/**
 * Sets the localStorage value for the date of the last tab opened
 * to an ISO timestamp of the current time.
 * @returns {undefined}
 */
const setLastTabOpenedDateInLocalStorage = () => {
  localStorageMgr.setItem(STORAGE_TABS_LAST_TAB_OPENED_DATE, moment.utc().toISOString())
}

/**
 * Sets the localStorage value for today's tab count to the value
 * of `tabCount`.
 * @param {number} tabCount - The number of tabs today
 * @returns {undefined}
 */
const setTabCountInLocalStorage = (tabCount) => {
  localStorageMgr.setItem(STORAGE_TABS_RECENT_DAY_COUNT, tabCount)
}

/**
 * Increment the count of tabs opened today (UTC day) in localStorage.
 * If the most recent day of a tab opening is prior to today, reset
 * the tab counter. If no values exist in localStorage, set them.
 * @returns {undefined}
 */
export const incrementTabsOpenedToday = function () {
  if (hasUserOpenedTabToday()) {
    // Increment the tab count
    const currentTabCount = getTabsOpenedTodayFromStorage()
    setTabCountInLocalStorage(currentTabCount + 1)
  } else {
    // Reset the date and tab count
    setLastTabOpenedDateInLocalStorage()
    setTabCountInLocalStorage(1)
  }
}

/**
 * Saves now as the approximate time the user installed the
 * browser extension (saving to localStorage). This helps us
 * distinguish truly new users from returning users who had
 * cleared their local data: if it exists and is recent, we
 * know the user is brand new.
 * @returns {undefined}
 */
export const setBrowserExtensionInstallTime = () => {
  localStorageMgr.setItem(STORAGE_APPROX_EXTENSION_INSTALL_TIME, moment.utc().toISOString())
}

/**
 * Gets the approximate time the user installed the browser
 * extension (from localStorage). The value may not exist;
 * e.g. if a user cleared their local data.
 * @returns {Date|null} The approximate datetime (in local
 *   time) the user installed the Tab for a Cause browser
 *   extension on this device.
 */
export const getBrowserExtensionInstallTime = () => {
  const timeISOString = localStorageMgr.getItem(STORAGE_APPROX_EXTENSION_INSTALL_TIME)
  const time = moment(timeISOString)
  if (!timeISOString || !time.isValid()) {
    return null
  }
  return time
}
