import moment from 'moment'
import UserModel from './UserModel'
import UserSearchLogModel from './UserSearchLogModel'
import { getTodaySearchCount } from './user-utils'
import getUserSearchEngine from './getUserSearchEngine'

const getSource = searchData => {
  const validSearchSources = ['self', 'chrome', 'ff', 'tab']
  return searchData.source && validSearchSources.indexOf(searchData.source) > -1
    ? searchData.source
    : null
}

const logSearchKnownUser = async (userContext, userId, searchData) => {
  let user
  try {
    user = await UserModel.get(userContext, userId)
  } catch (e) {
    throw e
  }

  // Update the user's counter for max searches in a day.
  // If this is the user's first search today, reset the counter
  // for the user's "current day" search count.
  // If today is also the day of all time max searches,
  // update the max searches day value.
  const todaySearchCount = getTodaySearchCount(user) + 1
  const isTodayMax = todaySearchCount >= user.maxSearchesDay.maxDay.numSearches
  const maxSearchesDayVal = {
    maxDay: {
      date: isTodayMax
        ? moment.utc().toISOString()
        : user.maxSearchesDay.maxDay.date,
      numSearches: isTodayMax
        ? todaySearchCount
        : user.maxSearchesDay.maxDay.numSearches,
    },
    recentDay: {
      date: moment.utc().toISOString(),
      numSearches: todaySearchCount,
    },
  }

  try {
    // @feature/search-impact: TFAC-965
    // TODO: provide impact to user for searching with a charitable
    // search engine.
    // const { limitReached } = await checkSearchRateLimit(userContext, userId)
    // if (!limitReached) {
    //   if (user.searchEngine === 'Yahoo' && user.yahooPaidSearchRewardOptIn) {
    //     user = await addVc(userContext, userId, 1)
    //   }
    // }

    // Increment the user's search count.
    const updateUserPromise = UserModel.update(userContext, {
      id: userId,
      searches: { $add: 1 },
      lastSearchTimestamp: moment.utc().toISOString(),
      maxSearchesDay: maxSearchesDayVal,
    })

    // Log the search for analytics.
    const source = getSource(searchData)
    const causeIdOnUser = user.v4BetaEnabled ? user.causeId : null
    const causeId =
      searchData && searchData.causeId ? searchData.causeId : causeIdOnUser
    const searchEngineId =
      searchData && searchData.searchEngineId
        ? searchData.searchEngineId
        : (await getUserSearchEngine(userContext, user)).id
    const logPromise = UserSearchLogModel.create(userContext, {
      userId,
      timestamp: moment.utc().toISOString(),
      ...(source && { source }),
      searchEngine: searchEngineId,
      ...(causeId && { causeId }),
      isAnonymous: false,
      version: 2,
    })
    ;[user] = await Promise.all([updateUserPromise, logPromise])
  } catch (e) {
    throw e
  }
  return {
    user,
    success: true,
  }
}

const logSearchAnonUser = async (userContext, anonUserId, searchData) => {
  try {
    const source = getSource(searchData)
    await UserSearchLogModel.create(userContext, {
      userId: anonUserId,
      timestamp: moment.utc().toISOString(),
      ...(source && { source }),
      ...(searchData.searchEngineId && {
        searchEngine: searchData.searchEngineId,
      }),
      ...(searchData.causeId && { causeId: searchData.causeId }),
      isAnonymous: true,
      version: 2, // anon user log search will only come from server-side logging
    })
  } catch (e) {
    throw e
  }
  return {
    success: true,
  }
}

/**
 * Log a user's search event and change related stats.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} anonUserId - The anonymous user id.
 * @return {Promise<User>} A promise that resolves into a User instance.
 */
const logSearch = async (userContext, userId, anonUserId, searchData = {}) => {
  if (userId && anonUserId) {
    throw new Error('userId and anonUserId cannot be set at once.')
  }

  if (userId) {
    return logSearchKnownUser(userContext, userId, searchData)
  }

  if (anonUserId) {
    return logSearchAnonUser(userContext, anonUserId, searchData)
  }

  throw new Error('One of userId and anonUserId must be defined.')
}

export default logSearch
