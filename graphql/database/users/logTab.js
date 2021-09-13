import moment from 'moment'
import get from 'lodash/get'
import { random } from 'lodash/number'
import UserModel from './UserModel'
import UserTabsLogModel from './UserTabsLogModel'
import UserMissionModel from '../missions/UserMissionModel'
import { DatabaseConditionalCheckFailedException } from '../../utils/exceptions'
import addVc from './addVc'
import {
  calculateMaxTabs,
  calculateTabStreak,
  getTodayTabCount,
} from './user-utils'
import getCampaign from '../globals/getCampaign'
import { getEstimatedMoneyRaisedPerTab } from '../globals/globals'
import getCurrentUserMission from '../missions/getCurrentUserMission'
import completeMission from '../missions/completeMission'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'
import logger from '../../utils/logger'

const missionsOverride = getPermissionsOverride(MISSIONS_OVERRIDE)

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
 * @param {boolean} isV4 - whether the user opened a tab in v4 or legacy
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
// eslint-disable-next-line no-unused-vars
const logTab = async (userContext, userId, tabId = null, isV4 = true) => {
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

  const maxTabsDay = calculateMaxTabs(todayTabCount, user.maxTabsDay)

  try {
    // TODO: parallelize the multiple awaits
    if (isValid) {
      // Only increment VC if we consider this a valid tab.
      user = await addVc(userContext, userId, 1)
    }

    if (isValid && !!get(user, 'currentMissionId', undefined)) {
      const userMission = await getCurrentUserMission({
        currentMissionId: user.currentMissionId,
        id: userId,
      })
      const memberInfo = userMission.squadMembers.find(member => {
        return member.userId === user.id
      })
      if (userMission.status === 'started') {
        const missionMaxTabsDay = calculateMaxTabs(
          todayTabCount,
          memberInfo.missionMaxTabsDay,
          memberInfo.tabs
        )
        const tabStreak = calculateTabStreak(
          memberInfo.missionMaxTabsDay,
          memberInfo.tabStreak
        )
        try {
          await UserMissionModel.update(missionsOverride, {
            missionId: user.currentMissionId,
            userId,
            tabs: { $add: 1 },
            missionMaxTabsDay,
            tabStreak,
          })
          if (userMission.tabCount + 1 >= userMission.tabGoal) {
            completeMission(userId, user.currentMissionId)
          }
        } catch (e) {
          logger.error(e)
        }
      }
    }

    // Increment the user's tab count and (if a valid tab) valid tab count.
    user = await UserModel.update(userContext, {
      id: userId,
      tabs: { $add: 1 },
      ...(isValid && { validTabs: { $add: 1 } }),
      lastTabTimestamp: moment.utc().toISOString(),
      maxTabsDay,
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
        isV4,
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

  // Keep track of the number of new users who join during a campaign.
  // When a user logs their first tab, we know they signed up and
  // verified their email address.
  if (user.tabs === 1) {
    try {
      // Get the currently-active campaign.
      const campaign = await getCampaign(userContext)

      // The campaign config will ignore this if the campaign is
      // no longer active or if we don't need to count new users.
      await campaign.incrementNewUserCount()
    } catch (e) {
      throw e
    }
  }

  // Track the number of valid tabs opened and estimated money raised
  // during a campaign.
  if (isValid) {
    try {
      const campaign = await getCampaign(userContext)
      await campaign.incrementTabCount()

      // Use estimated money raised per tab to track money raised during
      // the campaign.
      await campaign.addMoneyRaised(getEstimatedMoneyRaisedPerTab())
    } catch (e) {
      throw e
    }
  }

  return user
}

export default logTab
