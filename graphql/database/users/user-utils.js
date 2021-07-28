/* eslint import/prefer-default-export: 0 */
import moment from 'moment'

/**
 * Return the count of tabs opened today (UTC day).
 * @param {object} user - The user object from our DB
 * @return {number} The number of tabs opened today.
 */
export const getTodayTabCount = user => {
  const isFirstTabToday =
    moment(user.maxTabsDay.recentDay.date)
      .utc()
      .format('LL') !==
    moment()
      .utc()
      .format('LL')
  const todayTabCount = isFirstTabToday ? 0 : user.maxTabsDay.recentDay.numTabs
  return todayTabCount
}

/**
 * Return the count of searches made today (UTC day).
 * @param {object} user - The user object from our DB
 * @return {number} The number of searches made today.
 */
export const getTodaySearchCount = user => {
  const isFirstSearchToday =
    moment(user.maxSearchesDay.recentDay.date)
      .utc()
      .format('LL') !==
    moment()
      .utc()
      .format('LL')
  return isFirstSearchToday ? 0 : user.maxSearchesDay.recentDay.numSearches
}

export const calculateMaxTabs = a => {
  
}
