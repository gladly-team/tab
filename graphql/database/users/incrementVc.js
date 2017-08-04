
import moment from 'moment'
import UserModel from './UserModel'

/**
 * Increments the user vc by 1 only. Implements fraud protection by
 * only allowing the increment if too little time has passed since
 * the previous VC increment.
 * @param {object} userContext - The user authorizer object.
 * @param {string} id - The user id.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const incrementVc = async (userContext, userId) => {
  const COOLDOWN_SECONDS = 2
  var user = await UserModel.get(userContext, userId)
  const now = moment.utc()
  var lastTabTimestamp = (
    user.lastTabTimestamp
    ? moment.utc(user.lastTabTimestamp)
    : null
  )
  if (!lastTabTimestamp ||
    now.diff(lastTabTimestamp, 'seconds') > COOLDOWN_SECONDS) {
    user = await UserModel.addVc(userContext, userId, 1)
  }
  return user
}

export default incrementVc
