
import moment from 'moment'
import UserModel from './UserModel'
import addVc from './addVc'

/**
 * Return whether a tab opened now is "valid" for this user;
 * in other words, whether enough time has passed since the
 * last opened tab.
 * @param {object} userContext - The user authorizer object.
 * @param {string} id - The user id.
 * @return {Promise<boolean>}  A promise that resolves into a boolean.
 */
const isTabValid = async (userContext, userId) => {
  const COOLDOWN_SECONDS = 2
  try {
    var user = await UserModel.get(userContext, userId)
    const now = moment.utc()
    var lastTabTimestamp = (
      user.lastTabTimestamp
      ? moment.utc(user.lastTabTimestamp)
      : null
    )
    return (
      !lastTabTimestamp ||
      now.diff(lastTabTimestamp, 'seconds') > COOLDOWN_SECONDS
    )
  } catch (e) {
    throw e
  }
}

/**
 * Change the user's tab and VC stats accordingly when the
 * user opens a tab.
 * This only increments the VC if the tab is "valid",
 * which prevents "fradulent" tab spamming.
 * @param {object} userContext - The user authorizer object.
 * @param {string} id - The user id.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const logTab = async (userContext, userId) => {
  // Check if it's a valid tab before incrementing user VC or
  // the user's valid tab count.
  var isValid
  try {
    isValid = await isTabValid(userContext, userId)
  } catch (e) {
    throw e
  }

  var user
  try {
    if (isValid) {
      // Increment the user's tab count, valid tab count, and VC.
      user = await addVc(userContext, userId, 1)
      user = await UserModel.update(userContext, {
        id: userId,
        tabs: {$add: 1},
        validTabs: {$add: 1},
        lastTabTimestamp: moment.utc().toISOString()
      })
    } else {
      // Only increment the user's tab count.
      user = await UserModel.update(userContext, {
        id: userId,
        tabs: {$add: 1},
        lastTabTimestamp: moment.utc().toISOString()
      })
    }
  } catch (e) {
    throw e
  }
  return user
}

export default logTab
