
import moment from 'moment'
import UserModel from './UserModel'
import addVc from './addVc'

/**
 * Change the user's tab and VC stats accordingly.
 * This checks if the tab is "valid" -- in other words, if
 * enough time has passed since the last opened tab -- and only
 * increments the VC if the tab is valid.
 * @param {object} userContext - The user authorizer object.
 * @param {string} id - The user id.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const logTab = async (userContext, userId) => {
  // TODO: log tab

  // Check if it's a valid tab before incrementing user VC or
  // the user's valid tab count.
  // TODO: log valid tab
  const COOLDOWN_SECONDS = 2
  try {
    var user = await UserModel.get(userContext, userId)
    const now = moment.utc()
    var lastTabTimestamp = (
      user.lastTabTimestamp
      ? moment.utc(user.lastTabTimestamp)
      : null
    )
    if (!lastTabTimestamp ||
      now.diff(lastTabTimestamp, 'seconds') > COOLDOWN_SECONDS) {
      user = await addVc(userContext, userId, 1)
    }
  } catch (e) {
    throw e
  }
  return user
}

export default logTab
