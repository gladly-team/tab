
import moment from 'moment'
import UserModel from './UserModel'
import getNextLevelFor from '../userLevels/getNextLevelFor'

/**
 * Adds the specified virtual currency to the user's vc amount.
 * Added `vc` can be negative.
 * @param {object} userContext - The user authorizer object.
 * @param {string} id - The user id.
 * @param {integer} vc - The amount of virtual currency to add to the
 *   user's balance.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const addVc = async (userContext, userId, vc = 0) => {
  var user = await UserModel.update(userContext, {
    id: userId,
    vcCurrent: {$add: vc},
    vcAllTime: {$add: vc},
    heartsUntilNextLevel: {$add: -vc},
    lastTabTimestamp: moment.utc().toISOString()
  })

  // Check if user gained a level.
  if (user.heartsUntilNextLevel < 1) {
    const nextLevel = await getNextLevelFor(userContext,
      user.level, user.vcAllTime)
    if (nextLevel) {
      // Set the user's new level and related fields.
      user = await UserModel.update(userContext, {
        id: userId,
        level: nextLevel.id - 1, // current level is one fewer than next level
        heartsUntilNextLevel: (nextLevel.hearts - user.vcAllTime)
      })
    }
  }
  return user
}

export default addVc
