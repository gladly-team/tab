import moment from 'moment'
import { nanoid } from 'nanoid'
import UserModel from './UserModel'
import UserSearchLogModel from './UserSearchLogModel'
import { getTodaySearchCount } from './user-utils'
import getUserSearchEngine from './getUserSearchEngine'
import getSearchEngine from '../search/getSearchEngine'
import getCause from '../cause/getCause'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'

const getSource = searchData => {
  const validSearchSources = ['self', 'chrome', 'ff', 'tab']
  return searchData.source && validSearchSources.indexOf(searchData.source) > -1
    ? searchData.source
    : null
}

const createUserSearchLogModel = async (
  userContext,
  userId,
  causeId,
  searchEngineId,
  version,
  isAnonymous,
  source
) => {
  return UserSearchLogModel.create(userContext, {
    userId,
    timestamp: moment.utc().toISOString(),
    ...(source && { source }),
    searchEngine: searchEngineId || 'SearchForACause',
    ...(causeId && { causeId }),
    isAnonymous,
    version: version || 1,
  })
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
    const logPromise = createUserSearchLogModel(
      userContext,
      userId,
      causeId,
      searchEngineId,
      searchData.version,
      false,
      source
    )
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
    await createUserSearchLogModel(
      userContext,
      anonUserId,
      searchData.causeId,
      searchData.searchEngineId,
      searchData.version,
      true,
      source
    )
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
  // Do some validation on searchData fields (searchEngineId, causeId)
  if (searchData.searchEngineId) {
    try {
      await getSearchEngine(searchData.searchEngineId)
    } catch (e) {
      if (e instanceof DatabaseItemDoesNotExistException) {
        throw new Error('Provided search engine ID does not exist in DB')
      } else {
        throw e
      }
    }
  }
  if (searchData.causeId) {
    try {
      await getCause(searchData.causeId)
    } catch (e) {
      if (e instanceof DatabaseItemDoesNotExistException) {
        throw new Error('Provided cause ID does not exist in DB')
      } else {
        throw e
      }
    }
  }

  if (userId) {
    return logSearchKnownUser(userContext, userId, searchData)
  }

  let anonId = anonUserId
  const modifiedUserContext = Object.assign({}, userContext)
  if (!anonUserId) {
    anonId = nanoid()
    modifiedUserContext.anonId = anonId
  }

  return logSearchAnonUser(modifiedUserContext, anonId, searchData)
}

export default logSearch
