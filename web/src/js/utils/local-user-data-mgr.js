import moment from 'moment'
import uuid from 'uuid/v4'
import localStorageMgr from 'js/utils/localstorage-mgr'
import {
  SEARCH_STORAGE_NEW_USER_HAS_DISMISSED_INTRO,
  SEARCH_STORAGE_USER_BING_CLIENT_ID,
  STORAGE_DISMISSED_AD_EXPLANATION,
  STORAGE_EXTENSION_INSTALL_ID,
  STORAGE_APPROX_EXTENSION_INSTALL_TIME,
  STORAGE_TABS_RECENT_DAY_COUNT,
  STORAGE_TABS_LAST_TAB_OPENED_DATE,
  STORAGE_NOTIFICATIONS_DISMISS_TIME,
  STORAGE_CAMPAIGN_DISMISS_TIME,
  STORAGE_CLICKED_NEW_TAB_SEARCH_INTRO,
  STORAGE_CLICKED_NEW_TAB_SEARCH_INTRO_V2,
} from 'js/constants'

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
  const tabCountDate = localStorageMgr.getItem(
    STORAGE_TABS_LAST_TAB_OPENED_DATE
  )

  // If no current date, assume no tabs have been opened today.
  if (!tabCountDate) {
    return 0
  }

  // If the current date is the same as the most recent date a
  // tab was opened, it is not the first tab today.
  const hasOpenedTabToday =
    moment(tabCountDate)
      .utc()
      .format('LL') ===
    moment()
      .utc()
      .format('LL')
  return hasOpenedTabToday
}

/**
 * Get the count of tabs opened today (UTC day) from localStorage. If no
 * value exists in storage, return zero.
 * @returns {number} The user's tab count
 */
export const getTabsOpenedToday = function() {
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
  localStorageMgr.setItem(
    STORAGE_TABS_LAST_TAB_OPENED_DATE,
    moment.utc().toISOString()
  )
}

/**
 * Sets the localStorage value for today's tab count to the value
 * of `tabCount`.
 * @param {number} tabCount - The number of tabs today
 * @returns {undefined}
 */
const setTabCountInLocalStorage = tabCount => {
  localStorageMgr.setItem(STORAGE_TABS_RECENT_DAY_COUNT, tabCount)
}

/**
 * Increment the count of tabs opened today (UTC day) in localStorage.
 * If the most recent day of a tab opening is prior to today, reset
 * the tab counter. If no values exist in localStorage, set them.
 * @returns {undefined}
 */
export const incrementTabsOpenedToday = function() {
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
 * Saves a UUID to localStorage as the "extension install ID",
 * which may be helpful in determining if multiple anonymous
 * users belong to the same user.
 * @returns {undefined}
 */
export const setBrowserExtensionInstallId = () => {
  localStorageMgr.setItem(STORAGE_EXTENSION_INSTALL_ID, uuid())
}

/**
 * Gets the extension install ID from localStorage if it exists.
 * extension (from localStorage).
 * @returns {String|null} A UUID string, or null if it does not
 *   exist.
 */
export const getBrowserExtensionInstallId = () => {
  const installId = localStorageMgr.getItem(STORAGE_EXTENSION_INSTALL_ID)
  if (!installId) {
    return null
  }
  return installId
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
  localStorageMgr.setItem(
    STORAGE_APPROX_EXTENSION_INSTALL_TIME,
    moment.utc().toISOString()
  )
}

/**
 * Gets the approximate time the user installed the browser
 * extension (from localStorage). The value may not exist;
 * e.g. if a user cleared their local data.
 * @returns {Object|null} The approximate local MomentJS
 *   datetime the user installed the Tab for a Cause browser
 *   extension on this device.
 */
export const getBrowserExtensionInstallTime = () => {
  const timeISOString = localStorageMgr.getItem(
    STORAGE_APPROX_EXTENSION_INSTALL_TIME
  )
  const time = moment(timeISOString)
  if (!timeISOString || !time.isValid()) {
    return null
  }
  return time
}

/**
 * Marks that the user has dismissed the ad explanation.
 * @returns {undefined}
 */
export const setUserDismissedAdExplanation = () => {
  localStorageMgr.setItem(STORAGE_DISMISSED_AD_EXPLANATION, 'true')
}

/**
 * Gets whether the user has dismissed the ad explanation.
 * @returns {Boolean} Whether the user has dismissed the ad
 *   explanation.
 */
export const hasUserDismissedAdExplanation = () => {
  return localStorageMgr.getItem(STORAGE_DISMISSED_AD_EXPLANATION) === 'true'
}

/**
 * Saves now as the time the user dismissed the universal
 * notification.
 * @returns {undefined}
 */
export const setNotificationDismissTime = () => {
  localStorageMgr.setItem(
    STORAGE_NOTIFICATIONS_DISMISS_TIME,
    moment.utc().toISOString()
  )
}

/**
 * Returns whether the user has dismissed the notification
 * in the last few days.
 * @returns {Boolean}
 */
export const hasUserDismissedNotificationRecently = () => {
  const notificationDismissISOString = localStorageMgr.getItem(
    STORAGE_NOTIFICATIONS_DISMISS_TIME
  )
  const dismissTime = moment(notificationDismissISOString)
  if (!notificationDismissISOString || !dismissTime.isValid()) {
    return false
  }
  return (
    moment()
      .utc()
      .diff(dismissTime, 'days') < 8
  )
}

/**
 * Marks that the user has clicked or dismissed the notification on the
 * new tab page that introduces Search for a Cause.
 * @returns {undefined}
 */
export const setUserClickedNewTabSearchIntroNotif = () => {
  localStorageMgr.setItem(STORAGE_CLICKED_NEW_TAB_SEARCH_INTRO, 'true')
}

/**
 * Gets whether the user has clicked/dismissed the notification on the
 * new tab page that introduces Search for a Cause.
 * @returns {Boolean} Whether the user has clicked/dismissed the notification
 *   introducing Search.
 */
export const hasUserClickedNewTabSearchIntroNotif = () => {
  return (
    localStorageMgr.getItem(STORAGE_CLICKED_NEW_TAB_SEARCH_INTRO) === 'true'
  )
}

/**
 * Marks that the user has clicked or dismissed the notification on the
 * new tab page that introduces Search for a Cause.
 * @returns {undefined}
 */
export const setUserClickedNewTabSearchIntroNotifV2 = () => {
  localStorageMgr.setItem(STORAGE_CLICKED_NEW_TAB_SEARCH_INTRO_V2, 'true')
}

/**
 * Gets whether the user has clicked/dismissed the notification on the
 * new tab page that introduces Search for a Cause.
 * @returns {Boolean} Whether the user has clicked/dismissed the notification
 *   introducing Search.
 */
export const hasUserClickedNewTabSearchIntroNotifV2 = () => {
  return (
    localStorageMgr.getItem(STORAGE_CLICKED_NEW_TAB_SEARCH_INTRO_V2) === 'true'
  )
}

/**
 * Saves now as the time the user dismissed a campaign.
 * @returns {undefined}
 */
export const setCampaignDismissTime = () => {
  localStorageMgr.setItem(
    STORAGE_CAMPAIGN_DISMISS_TIME,
    moment.utc().toISOString()
  )
}

/**
 * Deletes the time the user dismissed a campaign.
 * @returns {undefined}
 */
export const removeCampaignDismissTime = () => {
  localStorageMgr.removeItem(STORAGE_CAMPAIGN_DISMISS_TIME)
}

/**
 * Returns whether the user has dismissed a campaign
 * in the last few days.
 * @returns {Boolean}
 */
export const hasUserDismissedCampaignRecently = () => {
  const campaignDismissISOString = localStorageMgr.getItem(
    STORAGE_CAMPAIGN_DISMISS_TIME
  )
  const dismissTime = moment(campaignDismissISOString)
  if (!campaignDismissISOString || !dismissTime.isValid()) {
    return false
  }
  return (
    moment()
      .utc()
      .diff(dismissTime, 'days') < 14
  )
}

/**
 * Marks that the user has dismissed the search page introduction.
 * @returns {undefined}
 */
export const setUserDismissedSearchIntro = () => {
  localStorageMgr.setItem(SEARCH_STORAGE_NEW_USER_HAS_DISMISSED_INTRO, 'true')
}

/**
 * Gets whether the user has dismissed the search page introduction.
 * @returns {Boolean} Whether the user has dismissed introduction
 *   message.
 */
export const hasUserDismissedSearchIntro = () => {
  return (
    localStorageMgr.getItem(SEARCH_STORAGE_NEW_USER_HAS_DISMISSED_INTRO) ===
    'true'
  )
}

/**
 * Saves the Bing user client ID to local storage. This is Bing's
 * X-MSEdge-ClientID value. See:
 * https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference#headers
 * @returns {undefined}
 */
export const setBingClientID = bingClientID => {
  localStorageMgr.setItem(SEARCH_STORAGE_USER_BING_CLIENT_ID, bingClientID)
}

/**
 * Get the Bing user client ID from local storage.
 * @returns {String|null}
 */
export const getBingClientID = () =>
  localStorageMgr.getItem(SEARCH_STORAGE_USER_BING_CLIENT_ID) || null
