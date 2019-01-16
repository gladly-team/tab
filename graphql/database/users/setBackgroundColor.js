import UserModel from './UserModel'
import { USER_BACKGROUND_OPTION_COLOR } from '../constants'

/**
 * Set user's background color.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @param {string} color - The background color.
 * @return {Promise<User>}  A promise that resolves into a User instance.
 */
const setBackgroundColor = async (userContext, userId, color) => {
  try {
    const userInstance = await UserModel.update(userContext, {
      id: userId,
      backgroundColor: color,
      backgroundOption: USER_BACKGROUND_OPTION_COLOR,
    })
    return userInstance
  } catch (e) {
    throw e
  }
}

export default setBackgroundColor
