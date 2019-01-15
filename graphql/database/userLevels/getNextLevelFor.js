import { forEach, sortBy } from 'lodash/collection'
import UserLevelModel from './UserLevelModel'

/**
 * Fetch the next level for the given level and all time vc.
 * @param {object} userContext - The user authorizer object.
 * @param {number} level - The user level id.
 * @param {number} vcAllTime - The user's all time VC.
 * @return {Promise<UserLevel> | null}  A promise that
 * resolve into an UserLevel object, or null if there is no next level.
 */
const getNextLevelFor = async (userContext, level, vcAllTime) => {
  const keys = [
    { id: level + 1 },
    { id: level + 2 },
    { id: level + 3 },
    { id: level + 4 },
    { id: level + 5 },
  ]

  var levels
  try {
    levels = await UserLevelModel.getBatch(userContext, keys)
  } catch (e) {
    throw e
  }

  // We've run out of levels.
  if (!levels || !levels.length) {
    return null
  }

  const sortedLevels = sortBy(levels, level => level.id)

  var levelToReturn
  forEach(sortedLevels, level => {
    // If the level's required hearts is greater than the
    // user's number of hearts, it is the user's next level.
    if (level.hearts > vcAllTime) {
      levelToReturn = level
      return false
    }
  })
  if (levelToReturn) {
    return levelToReturn
  } else {
    // Fetch more levels.
    return getNextLevelFor(userContext, levels[levels.length - 1].id, vcAllTime)
  }
}

export default getNextLevelFor
