import moment from 'moment'

import { isValidISOString } from '../../utils/utils'
import UserSearchLogModel from './UserSearchLogModel'
import UserModel from './UserModel'
import { getTodaySearchCount } from './user-utils'

const MAX_SEARCHES_ONE_MINUTE = 6
const MAX_SEARCHES_FIVE_MINUTES = 15
const MAX_SEARCHES_ONE_DAY = 150

const LIMIT_REASON_ONE_MINUTE_MAX = 'ONE_MINUTE_MAX'
const LIMIT_REASON_FIVE_MINUTE_MAX = 'FIVE_MINUTE_MAX'
const LIMIT_REASON_DAILY_MAX = 'DAILY_MAX'
const LIMIT_REASON_NONE = 'NONE'

const createSearchRateLimit = ({
  limitReached = false,
  reason = LIMIT_REASON_NONE,
  checkIfHuman = false,
}) => ({
  limitReached,
  reason,
  checkIfHuman,
})

/**
 * Get an array of a user's search logs in a certain time period.
 * @param {Object} userContext - The user authorizer object.
 * @param {String} userId - The user ID.
 * @param {Object} time
 * @param {String} time.start - An ISO string of the earliest search log
 *   to filter on
 * @param {String} time.end - An ISO string of the latest search log
 *   to filter on
 * @return {Promise<Object[]>} searchLogs - A list of UserSearchLog objects
 */
const getSearchLogs = async (userContext, userId, time = {}) => {
  // Build the basic query
  const searchLogsQuery = UserSearchLogModel.query(userContext, userId)

  // Validate startTime and/or endTime, if provided
  if (time.start && !isValidISOString(time.start)) {
    throw new Error('Invalid `time.start` argument. It must be an ISO string.')
  }
  if (time.end && !isValidISOString(time.end)) {
    throw new Error('Invalid `time.end` argument. It must be an ISO string.')
  }

  // Filter by time.start and/or time.end, if provided
  if (time.start && time.end) {
    searchLogsQuery.where('timestamp').between(time.start, time.end)
  } else if (time.start) {
    searchLogsQuery.where('timestamp').gte(time.start)
  } else if (time.end) {
    searchLogsQuery.where('timestamp').lte(time.end)
  }
  return searchLogsQuery.execute()
}

/**
 * Get the count of recruits returned from the `getRecruits` query
 *   who remained active for at least one day after joining.
 * @param {Object} userContext - The user authorizer object.
 * @param {String} userId - The user ID.
 * @return {Promise<Object>} searchRateLimitInfo - A Promise that resolves
 *   into info about whether the user has exceeded search rate limits.
 * @param {Boolean} limitReached - Whether the user has reached some
 *   rate limit
 * @param {String} reason - The reason the user's search is rate-limited.
 *   One of: ONE_MINUTE_MAX, FIVE_MINUTE_MAX, DAILY_MAX, or NONE (if
 *   limitReached is false).
 * @param {Boolean} checkIfHuman - Whether it's possible the user is a
 *   bot, and we should chec,k
 */
const checkSearchRateLimit = async (userContext, userId) => {
  // Validate the required parameters.
  if (!(userContext && userId)) {
    throw new Error(
      'checkSearchRateLimit requires params "userContext" and "userId".'
    )
  }

  const now = moment.utc()
  const time = {
    start: now
      .clone()
      .subtract(10, 'minutes')
      .toISOString(),
    end: now.clone().toISOString(),
  }

  const user = await UserModel.get(userContext, userId)
  const searchesToday = getTodaySearchCount(user)
  if (searchesToday > MAX_SEARCHES_ONE_DAY) {
    return createSearchRateLimit({
      limitReached: true,
      reason: LIMIT_REASON_DAILY_MAX,
      checkIfHuman: false,
    })
  }

  // Determine the number of searches the user has made in
  // previous time buckets.
  const searchLogs = await getSearchLogs(userContext, userId, time)
  const searchesPerTimePeriod = searchLogs.reduce(
    (accumulator, curVal) => {
      const searchLogTime = moment(curVal.timestamp)
      const updatedCount = {
        previousOneMinute: searchLogTime.isBetween(
          now.clone().subtract(1, 'minute'),
          now
        )
          ? accumulator.previousOneMinute + 1
          : accumulator.previousOneMinute,
        previousFiveMinutes: searchLogTime.isBetween(
          now.clone().subtract(5, 'minutes'),
          now
        )
          ? accumulator.previousFiveMinutes + 1
          : accumulator.previousFiveMinutes,
        previousTenMinutes: searchLogTime.isBetween(
          now.clone().subtract(10, 'minutes'),
          now
        )
          ? accumulator.previousTenMinutes + 1
          : accumulator.previousTenMinutes,
      }
      return updatedCount
    },
    {
      previousOneMinute: 0,
      previousFiveMinutes: 0,
      previousTenMinutes: 0,
    }
  )

  if (searchesPerTimePeriod.previousFiveMinutes > MAX_SEARCHES_FIVE_MINUTES) {
    return createSearchRateLimit({
      limitReached: true,
      reason: LIMIT_REASON_FIVE_MINUTE_MAX,
      checkIfHuman: false,
    })
  }
  if (searchesPerTimePeriod.previousOneMinute > MAX_SEARCHES_ONE_MINUTE) {
    return createSearchRateLimit({
      limitReached: true,
      reason: LIMIT_REASON_ONE_MINUTE_MAX,
      checkIfHuman: false,
    })
  }
  return createSearchRateLimit({
    limitReached: false,
    reason: LIMIT_REASON_NONE,
    checkIfHuman: false,
  })
}

export default checkSearchRateLimit
