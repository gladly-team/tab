import moment from 'moment'
import { random } from 'lodash/number'
import UserModel from './UserModel'
import UserTabsLogModel from './UserTabsLogModel'
import { DatabaseConditionalCheckFailedException } from '../../utils/exceptions'
import addVc from './addVc'
import { getTodayTabCount } from './user-utils'
import getCampaign from '../globals/getCampaign'

/**
 * Return whether a tab opened now is "valid" for this user;
 * in other words, whether enough time has passed since the
 * last opened tab and the user has not exceeded the maximum
 * hearts from tabs in a day.
 * @param {number} tabsOpenedToday - The count of tabs the user
 * has opened today.
 * @param {string} lastTabTimestampStr - The ISO string datetime of
 *   when the user last opened a tab.
 * @return {boolean}  Whether the tab is valid.
 */
const isTabValid = (tabsOpenedToday, lastTabTimestampStr) => {
  const COOLDOWN_SECONDS = 2
  const now = moment.utc()
  const lastTabTimestamp = lastTabTimestampStr
    ? moment.utc(lastTabTimestampStr)
    : null
  const enoughTimeSinceLastTab =
    !lastTabTimestamp ||
    now.diff(lastTabTimestamp, 'seconds') > COOLDOWN_SECONDS

  // Note: we're basing this on tabs opened today, and not all
  // previous tabs necessarily earned a heart. E.g., if a previous
  // tabs was invalid for another reason, it would not earn a heart
  // but would still count toward the 150 tab limit. That means
  // a user might be limited to fewer than 150 hearts on some days.
  const MAX_DAILY_HEARTS_FROM_TABS = 150
  const belowDailyHeartsLimit = tabsOpenedToday < MAX_DAILY_HEARTS_FROM_TABS

  return enoughTimeSinceLastTab && belowDailyHeartsLimit
}

/**
 * Add a random number of milliseconds (between 1 and 20 ms) to an
 * ISO string datetime.
 * @param {String} ISODatetime - An ISO datetime string
 * @return {String} An ISO datetime with the milliseconds up to
 *   20ms greater than the provided ISODatetime.
 */
const addMillisecondsToISODatetime = ISODatetime => {
  const msToAdd = random(1, 20)
  return moment(ISODatetime)
    .add(msToAdd, 'milliseconds')
    .toISOString()
}

/**
 * Change the user's tab and VC stats accordingly when the
 * user opens a tab.
 * This only increments the VC if the tab is "valid",
 * which prevents "fradulent" tab spamming.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} tabId - A UUID for this opened tab
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const logTab = async (userContext, userId, tabId = null) => {
  // Check if it's a valid tab before incrementing user VC or
  // the user's valid tab count.
  let user
  try {
    user = await UserModel.get(userContext, userId)
  } catch (e) {
    throw e
  }
  const todayTabCount = getTodayTabCount(user) + 1
  const isValid = isTabValid(todayTabCount, user.lastTabTimestamp)

  // Update the user's counter for max tabs in a day.
  // If this is the user's first tab today, reset the counter
  // for the user's "current day" tab count.
  // If today is also the day of all time max tabs,
  // update the max tabs day value.
  const isTodayMax = todayTabCount >= user.maxTabsDay.maxDay.numTabs
  const maxTabsDayVal = {
    maxDay: {
      date: isTodayMax
        ? moment.utc().toISOString()
        : user.maxTabsDay.maxDay.date,
      numTabs: isTodayMax ? todayTabCount : user.maxTabsDay.maxDay.numTabs,
    },
    recentDay: {
      date: moment.utc().toISOString(),
      numTabs: todayTabCount,
    },
  }

  try {
    // TODO: parallelize the multiple awaits
    if (isValid) {
      // Only increment VC if we consider this a valid tab.
      user = await addVc(userContext, userId, 1)
    }

    // Increment the user's tab count and (if a valid tab) valid tab count.
    user = await UserModel.update(userContext, {
      id: userId,
      tabs: { $add: 1 },
      ...(isValid && { validTabs: { $add: 1 } }),
      lastTabTimestamp: moment.utc().toISOString(),
      maxTabsDay: maxTabsDayVal,
    })
  } catch (e) {
    throw e
  }

  // Log the tab for analytics whether a valid tab or not.
  let i = 0
  const maxTries = 2
  const logTabTimestamp = moment.utc().toISOString()
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await UserTabsLogModel.create(userContext, {
        userId,
        timestamp: addMillisecondsToISODatetime(logTabTimestamp),
        ...(tabId && { tabId }),
      })
      break // successfully logged
    } catch (e) {
      i += 1
      // If the DB conditional check, failed, an item already exists with these
      // keys. In that case, try to log again with modified timestamps.
      // This happens when a user opens two tabs that at identical times.
      if (e.code === DatabaseConditionalCheckFailedException.code) {
        if (i > maxTries) {
          throw e
        }
      } else {
        throw e
      }
    }
  }

  // Optionally, keep track of the number of new users who join during a
  // campaign. When a user logs their first tab, we know they signed up
  // and verified their email address. Increment the campaign's user count
  // in Redis.
  if (user.tabs === 1) {
    try {
      // Get the currently-active campaign.
      const campaign = await getCampaign(userContext)

      // TODO: update tests.

      // If the campaign is active (we are between the campaign's start
      // and end times), increment the new user count.
      if (campaign.isActive()) {
        await campaign.incrementTabCount()
      }
    } catch (e) {
      // The Redis caller handles error logging.
    }
  }

  return user
}

export default logTab
