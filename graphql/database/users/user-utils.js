/* eslint import/prefer-default-export: 0 */
import moment from 'moment'

/**
 * Return the count of tabs opened today (UTC day).
 * @param {object} user - The user object from our DB
 * @return {number} The number of tabs opened today.
 */
export const getTodayTabCount = (user) => {
  const isFirstTabToday =
    moment(user.maxTabsDay.recentDay.date).utc().format('LL') !==
    moment().utc().format('LL')
  const todayTabCount = isFirstTabToday ? 0 : user.maxTabsDay.recentDay.numTabs
  return todayTabCount
}

/**
 * Return the count of searches made today (UTC day).
 * @param {object} user - The user object from our DB
 * @return {number} The number of searches made today.
 */
export const getTodaySearchCount = (user) => {
  const isFirstSearchToday =
    moment(user.maxSearchesDay.recentDay.date).utc().format('LL') !==
    moment().utc().format('LL')
  return isFirstSearchToday ? 0 : user.maxSearchesDay.recentDay.numSearches
}

/**
 * Updates the max day object as appropriate given todays tab count.
 * @param {object} maxDayObject
 * @param {int} todayTabCount number of tabs logged today
 * @return {object} The updated max day object
 */
export const calculateMaxTabs = (
  todayTabCount,
  maxDayObject,
  maxPossibleSquadTabs
) => {
  // Update the user's counter for max tabs in a day.
  // If this is the user's first tab today, reset the counter
  // for the user's "current day" tab count.
  // If today is also the day of all time max tabs,
  // update the max tabs day value.
  const isTodayMax = todayTabCount >= maxDayObject.maxDay.numTabs
  const highestPossibleTabCount =
    maxPossibleSquadTabs && maxPossibleSquadTabs < todayTabCount
      ? maxPossibleSquadTabs + 1
      : todayTabCount
  return {
    maxDay: {
      date: isTodayMax ? moment.utc().toISOString() : maxDayObject.maxDay.date,
      numTabs: isTodayMax
        ? highestPossibleTabCount
        : maxDayObject.maxDay.numTabs,
    },
    recentDay: {
      date: moment.utc().toISOString(),

      // we have an issue where we calculate the max tabs on a users entire day
      // but a user can join a mission at any point in the day.  This ensures we only count
      // tabs on the first day after the user joined the mission for max tabs
      numTabs: highestPossibleTabCount,
    },
  }
}

/**
 * Calculates tab streak for the current user.
 * @param {object} maxDayObject
 * @param {object} tabStreakObject
 * @return {object} The current and longest tab streaks
 */
export const calculateTabStreak = (maxDayObject, tabStreakObject) => {
  const recentDay = moment(maxDayObject.recentDay.date)
  const isYesterday = moment().subtract(1, 'days').isSame(recentDay, 'd')
  const isPreviousDay = recentDay.isBefore(
    moment().subtract(1, 'days').startOf('day')
  )
  // if this is invoked, then tabstreak should atleast be 1
  let newCurrentTabStreak = tabStreakObject.currentTabStreak || 1
  let newLongestTabStreak = tabStreakObject.longestTabStreak || 1

  if (isYesterday) {
    newCurrentTabStreak += 1
    if (newCurrentTabStreak > tabStreakObject.longestTabStreak) {
      newLongestTabStreak = newCurrentTabStreak
    }
  } else if (isPreviousDay) {
    newCurrentTabStreak = 1
  }

  return {
    currentTabStreak: newCurrentTabStreak,
    longestTabStreak: newLongestTabStreak,
  }
}
