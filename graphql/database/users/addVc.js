
import moment from 'moment'
import UserModel from './UserModel'

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
  const user = await UserModel.update(userContext, {
    id: userId,
    vcCurrent: {$add: vc},
    vcAllTime: {$add: vc},
    heartsUntilNextLevel: {$add: -vc},
    // TODO: switch all to toISOString()
    lastTabTimestamp: moment.utc().format()
    // lastTabTimestamp: moment.utc().toISOString()
  })
  // TODO: check if user gained a level.
  return user
}

export default addVc
