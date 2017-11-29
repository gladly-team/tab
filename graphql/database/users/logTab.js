
import moment from 'moment'
import UserModel from './UserModel'
import UserTabsLogModel from './UserTabsLogModel'
import addVc from './addVc'

/**
 * Return whether a tab opened now is "valid" for this user;
 * in other words, whether enough time has passed since the
 * last opened tab.
 * @param {object} userContext - The user authorizer object.
 * @param {string} lastTabTimestampStr - The ISO string datetime of
 *   when the user last opened a tab.
 * @return {boolean}  Whether the tab is valid.
 */
const isTabValid = (userContext, lastTabTimestampStr) => {
  const COOLDOWN_SECONDS = 2
  const now = moment.utc()
  var lastTabTimestamp = (
    lastTabTimestampStr
    ? moment.utc(lastTabTimestampStr)
    : null
  )
  return (
    !lastTabTimestamp ||
    now.diff(lastTabTimestamp, 'seconds') > COOLDOWN_SECONDS
  )
}

/**
 * Change the user's tab and VC stats accordingly when the
 * user opens a tab.
 * This only increments the VC if the tab is "valid",
 * which prevents "fradulent" tab spamming.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const logTab = async (userContext, userId) => {
  // Check if it's a valid tab before incrementing user VC or
  // the user's valid tab count.
  try {
    var user = await UserModel.get(userContext, userId)
  } catch (e) {
    throw e
  }
  const isValid = isTabValid(userContext, user.lastTabTimestamp)

  // Update the user's counter for max tabs in a day.
  // If this is the user's first tab today, reset the counter
  // for the user's "current day" tab count.
  // If today is also the day of all time max tabs,
  // update the max tabs day value.
  const isFirstTabToday = (
    moment(user.maxTabsDay.recentDay.date).utc().format('LL') !==
    moment().utc().format('LL')
  )
  const todayTabCount = (
    isFirstTabToday
    ? 1
    : user.maxTabsDay.recentDay.numTabs + 1
  )
  const isTodayMax = todayTabCount >= user.maxTabsDay.maxDay.numTabs
  const maxTabsDayVal = {
    maxDay: {
      date: isTodayMax
        ? moment.utc().toISOString()
        : user.maxTabsDay.maxDay.date,
      numTabs: isTodayMax
        ? todayTabCount
        : user.maxTabsDay.maxDay.numTabs
    },
    recentDay: {
      date: moment.utc().toISOString(),
      numTabs: todayTabCount
    }
  }

  try {
    if (isValid) {
      // TODO: parallelize the multiple awaits
      // Increment the user's tab count, valid tab count, and VC.
      user = await addVc(userContext, userId, 1)
      user = await UserModel.update(userContext, {
        id: userId,
        tabs: {$add: 1},
        validTabs: {$add: 1},
        lastTabTimestamp: moment.utc().toISOString(),
        maxTabsDay: maxTabsDayVal
      })

      // Log the tab for analytics.
      await UserTabsLogModel.create(userContext, {
        userId: userId,
        timestamp: moment.utc().toISOString()
      })
    } else {
      // Only increment the user's tab count.
      user = await UserModel.update(userContext, {
        id: userId,
        tabs: {$add: 1},
        lastTabTimestamp: moment.utc().toISOString(),
        maxTabsDay: maxTabsDayVal
      })
    }
  } catch (e) {
    throw e
  }
  return user
}

export default logTab
